import { config } from './config';
import { courses, certifications, getCoursesByTrack, getCertificationCourses } from './courses';
import { createStyles } from './styles';
import { GET_USER_PROGRESS } from './queries';
import { createTemplates } from './templates';
import { 
  TrackName, 
  CertificationName, 
  CourseData, 
  WidgetState,
  CourseStatus 
} from './types';

export function createWidget(customConfig = {}) {
  const mergedConfig = { ...config, ...customConfig };
  const styles = createStyles(mergedConfig);
  const templates = createTemplates(mergedConfig);

  const state: WidgetState = {
    selectedTrack: getInitialTrack(),
    userCourses: [],
    isLoading: true,
    error: undefined
  };

  const widget = initializeWidget();
  const trackSelect = createTrackSelector();
  setupWidgetEventHandlers(widget);
  fetchUserProgress();

  function getInitialTrack(): TrackName {
    const availableTracks = getAvailableTracks();
    const storedTrack = safelyGetStoredTrack();
    return storedTrack && availableTracks.includes(storedTrack) 
      ? storedTrack 
      : availableTracks[0];
  }

  function getAvailableTracks(): TrackName[] {
    return [...new Set(Object.values(courses).flatMap(course => course.tracks))];
  }

  function safelyGetStoredTrack(): TrackName | null {
    try {
      return localStorage.getItem('apollo-odyssey-selected-track') as TrackName;
    } catch {
      return null;
    }
  }

  function initializeWidget(): HTMLElement {
    removeExistingWidget();
    const widget = createElement('div', {
      id: 'apollo-odyssey-tracking-widget',
      style: styles.widget,
      innerHTML: templates.loading
    });
    document.body.appendChild(widget);
    return widget;
  }

  function createElement(tag: string, props: Record<string, string>): HTMLElement {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => element[key] = value);
    return element;
  }

  function removeExistingWidget() {
    document.getElementById('apollo-odyssey-tracking-widget')?.remove();
  }

  function createTrackSelector(): HTMLSelectElement {
    const select = createElement('select', { style: styles.dropdown }) as HTMLSelectElement;
    getAvailableTracks().forEach(track => addTrackOption(select, track));
    return select;
  }

  function addTrackOption(select: HTMLSelectElement, track: TrackName) {
    const option = createElement('option', {
      value: track,
      textContent: track,
      selected: track === state.selectedTrack ? 'true' : ''
    });
    select.appendChild(option);
  }

  function setupWidgetEventHandlers(widget: HTMLElement) {
    document.addEventListener('click', handleOutsideClick, { capture: true });
    widget.addEventListener('click', event => event.stopPropagation());
    trackSelect.addEventListener('change', handleTrackChange);
  }

  function handleOutsideClick(event: MouseEvent) {
    if (!widget.contains(event.target as Node)) {
      widget.remove();
    }
  }

  function handleTrackChange() {
    state.selectedTrack = trackSelect.value as TrackName;
    safelyStoreTrack(state.selectedTrack);
    renderTrackCourses();
  }

  function safelyStoreTrack(track: TrackName) {
    try {
      localStorage.setItem('apollo-odyssey-selected-track', track);
    } catch {}
  }

  function getCourseStatus(courseData?: CourseData): CourseStatus {
    if (!courseData) {
      return {
        text: `${mergedConfig.icons.notStarted} Not Started`,
        style: styles.status.notStarted
      };
    }

    return courseData.completedAt ? {
      text: `${mergedConfig.icons.completed} ${mergedConfig.text.completed}`,
      style: styles.status.completed
    } : {
      text: `${mergedConfig.icons.inProgress} In Progress`,
      style: styles.status.inProgress
    };
  }

  function buildCourseUrl(courseId: string): string {
    return `https://www.apollographql.com/tutorials/${courseId.replace('/v2', '')}`;
  }

  function renderTrackCourses() {
    const trackCourses = getCoursesByTrack(state.selectedTrack);
    const courseMap = new Map(state.userCourses.map(course => [course.id, course]));
    
    const certificationSections = renderCertificationSections(courseMap);
    const remainingCoursesSection = renderRemainingCourses(trackCourses, courseMap);
    
    const isCompleted = areAllCoursesCompleted(trackCourses, courseMap);
    const trackStatus = isCompleted 
      ? `<span style="color: ${mergedConfig.colors.success}"> (${mergedConfig.text.trackCompleted})</span>`
      : '';

    widget.innerHTML = `
      <div style="${styles.container}${isCompleted ? styles.completed : ''}">
        ${templates.trackHeader(isCompleted, trackStatus)}
        <div id="dropdown-container"></div>
        ${certificationSections}
        ${remainingCoursesSection}
        <div style="${styles.buttonContainer}">
          <button id="test-close-btn" style="${styles.closeButton}">Close</button>
        </div>
      </div>
    `;

    attachControls();
  }

  function areAllCoursesCompleted(courseIds: string[], courseMap: Map<string, CourseData>): boolean {
    return courseIds.every(courseId => courseMap.get(courseId)?.completedAt);
  }

  function renderCertificationSections(courseMap: Map<string, CourseData>): string {
    return Object.keys(certifications)
      .map(certName => renderCertificationSection(certName as CertificationName, courseMap))
      .filter(Boolean)
      .join('');
  }

  function renderCertificationSection(certName: CertificationName, courseMap: Map<string, CourseData>): string {
    const certCourses = getCertificationCourses(certName, state.selectedTrack);
    if (!certCourses.length) return '';

    const cert = certifications[certName];
    const isCompleted = areAllCoursesCompleted(certCourses, courseMap);

    return `
      <div style="${styles.certGroup}${isCompleted ? styles.completed : ''}">
        ${renderCertificationHeader(cert.name, isCompleted)}
        ${cert.description ? `<p style="${styles.certDescription}">${cert.description}</p>` : ''}
        <ul style="${styles.list}">
          ${certCourses.map(courseId => renderCourseItem(courseId, courseMap)).join('')}
        </ul>
      </div>
    `;
  }

  function renderCertificationHeader(name: string, isCompleted: boolean): string {
    const icon = isCompleted ? mergedConfig.icons.certification : mergedConfig.icons.certificationInProgress;
    const status = isCompleted 
      ? `<span style="color: ${mergedConfig.colors.success}"> (${mergedConfig.text.completed})</span>`
      : '';
    return `<h3 style="${styles.certHeader}">${icon} ${name}${status}</h3>`;
  }

  function renderRemainingCourses(trackCourses: string[], courseMap: Map<string, CourseData>): string {
    const certCourses = new Set(Object.keys(certifications)
      .flatMap(certName => getCertificationCourses(certName as CertificationName, state.selectedTrack))
    );
    
    const remainingCourses = trackCourses.filter(id => !certCourses.has(id));
    if (!remainingCourses.length) return '';

    return `
      <div style="${styles.group}">
        <ul style="${styles.list}">
          ${remainingCourses.map(courseId => renderCourseItem(courseId, courseMap)).join('')}
        </ul>
      </div>
    `;
  }

  function renderCourseItem(courseId: string, courseMap: Map<string, CourseData>): string {
    const courseData = courseMap.get(courseId);
    const courseInfo = courses[courseId];
    const { text: statusText, style: statusStyle } = getCourseStatus(courseData);
    return templates.courseItem(courseInfo.title, buildCourseUrl(courseId), statusText, statusStyle);
  }

  function attachControls() {
    document.getElementById('dropdown-container')?.appendChild(trackSelect);
    document.getElementById('test-close-btn')!.onclick = () => widget.remove();
  }

  async function fetchUserProgress() {
    try {
      const response = await fetch('https://graphql.api.apollographql.com/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: GET_USER_PROGRESS })
      });
      
      const data = await response.json();
      state.userCourses = data?.data?.me?.courses || [];
      state.isLoading = false;
      renderTrackCourses();
    } catch {
      widget.innerHTML = templates.loginPrompt();
    }
  }
}

if (typeof window !== 'undefined') {
  try {
    createWidget();
  } catch (error) {
    console.error('Failed to initialize widget:', error);
  }
} 