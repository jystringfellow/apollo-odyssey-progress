import { config } from './config';
import { courses, certifications, getCoursesByTrack, getCertificationCourses } from './courses';
import { createStyles } from './styles';
import { CertificationName, CourseData, TrackName } from './types';

export function createWidget(customConfig = {}) {
  const mergedConfig = { ...config, ...customConfig };
  const styles = createStyles(mergedConfig);

  // Safely get stored track with fallback
  let initialTrack: TrackName;
  try {
    const storedTrack = localStorage.getItem('apollo-odyssey-selected-track') as TrackName;
    const defaultTrack = Object.keys(courses)[0] as TrackName;
    initialTrack = storedTrack || defaultTrack;
  } catch {
    initialTrack = Object.keys(courses)[0] as TrackName;
  }

  // Remove existing widget if present
  document.getElementById('apollo-odyssey-tracking-widget')?.remove();

  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'apollo-odyssey-tracking-widget';
  widget.style.cssText = styles.widget;
  widget.innerHTML = '<strong style="font-size:16px;">🚀 Loading...</strong>';
  document.body.appendChild(widget);

  // Create track selector dropdown
  const trackSelect = document.createElement('select');
  trackSelect.style.cssText = styles.dropdown;
  
  // Get unique tracks from courses
  const tracks = [...new Set(Object.values(courses).flatMap(course => course.tracks))];
  tracks.forEach(track => {
    const option = document.createElement('option');
    option.value = track;
    option.textContent = track;
    trackSelect.appendChild(option);
  });

  // Add click handler to close widget when clicking outside
  document.addEventListener('click', function(event) {
    const widget = document.getElementById('apollo-odyssey-tracking-widget');
    if (widget && !widget.contains(event.target as Node)) {
      widget.remove();
    }
  }, { capture: true });

  // Prevent widget from closing when clicking inside it
  widget.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  function renderCourseItem(courseId: string, courseMap: Map<string, CourseData>) {
    const courseData = courseMap.get(courseId);
    const courseInfo = courses[courseId];
    let statusText: string, statusStyle: string;

    if (courseData) {
      if (courseData.completedAt) {
        statusText = `${mergedConfig.icons.completed} ${mergedConfig.text.completed}`;
        statusStyle = styles.status.completed;
      } else {
        statusText = `${mergedConfig.icons.inProgress} In Progress`;
        statusStyle = styles.status.inProgress;
      }
    } else {
      statusText = `${mergedConfig.icons.notStarted} Not Started`;
      statusStyle = styles.status.notStarted;
    }

    const courseUrl = `https://www.apollographql.com/tutorials/${courseId.replace('/v2', '')}`;

    return `<li style="${styles.listItem}">
      <a href="${courseUrl}" style="${styles.link}">
        <strong>${courseInfo.title}</strong>
      </a>: <span style="${statusStyle}">${statusText}</span>
    </li>`;
  }

  function isCertificationCompleted(certCourses: string[], courseMap: Map<string, CourseData>) {
    return certCourses.every(courseId => courseMap.get(courseId)?.completedAt);
  }

  function isTrackCompleted(trackCourses: string[], courseMap: Map<string, CourseData>) {
    return trackCourses.every(courseId => courseMap.get(courseId)?.completedAt);
  }

  function renderTrackCourses(trackName: TrackName, userCourses: CourseData[]) {
    const trackCourses = getCoursesByTrack(trackName);
    const courseMap = new Map(userCourses.map(course => [course.id, course]));
    let html = '';

    // Render certification groups first
    Object.keys(certifications).forEach((certName) => {
      const certCourses = getCertificationCourses(certName as CertificationName, trackName);
      if (certCourses.length > 0) {
        const cert = certifications[certName];
        const isCompleted = isCertificationCompleted(certCourses, courseMap);
        html += `
          <div style="${styles.certGroup}${isCompleted ? styles.completed : ''}">
            <h3 style="${styles.certHeader}">
              ${isCompleted ? mergedConfig.icons.certification : mergedConfig.icons.certificationInProgress} ${cert.name}
              ${isCompleted ? `<span style="color: ${mergedConfig.colors.success}"> (${mergedConfig.text.completed})</span>` : ''}
            </h3>
            ${cert.description ? `<p style="${styles.certDescription}">${cert.description}</p>` : ''}
            <ul style="${styles.list}">
              ${certCourses.map(courseId => renderCourseItem(courseId, courseMap)).join('')}
            </ul>
          </div>
        `;
      }
    });

    // Get all certification courses
    const certCourses = new Set(Object.keys(certifications).flatMap(certName => 
      getCertificationCourses(certName as CertificationName, trackName)
    ));

    // Filter out certified courses from remaining courses
    const remainingCourses = trackCourses.filter(id => !certCourses.has(id));

    if (remainingCourses.length > 0) {
      html += `
        <div style="${styles.group}">
          <ul style="${styles.list}">
            ${remainingCourses.map(courseId => renderCourseItem(courseId, courseMap)).join('')}
          </ul>
        </div>
      `;
    }

    const isCompleted = isTrackCompleted(trackCourses, courseMap);
    widget.innerHTML = `
      <div style="${styles.container}${isCompleted ? styles.completed : ''}">
        <strong style="${styles.header}">
          ${isCompleted ? mergedConfig.icons.trackCompleted : mergedConfig.icons.track} Apollo Odyssey Course Progress
          ${isCompleted ? `<span style="color: ${mergedConfig.colors.success}"> (${mergedConfig.text.trackCompleted})</span>` : ''}
        </strong>
        <div id="dropdown-container"></div>
        ${html}
        <div style="${styles.buttonContainer}">
          <button id="test-close-btn" style="${styles.closeButton}">Close</button>
        </div>
      </div>
    `;

    document.getElementById('dropdown-container')!.appendChild(trackSelect);
    document.getElementById('test-close-btn')!.onclick = () => widget.remove();
  }

  // Fetch user's course progress
  fetch('https://graphql.api.apollographql.com/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      query: `query GetUser {
        me {
          ... on User {
            ...User
            __typename
          }
          __typename
        }
      }
      
      fragment User on User {
        id
        fullName
        email
        courses: odysseyCourses {
          ...Course
          __typename
        }
        __typename
      }
      
      fragment Course on OdysseyCourse {
        id
        completedAt
        enrolledAt
        __typename
      }`
    })
  })
  .then(response => response.json())
  .then(data => {
    const userCourses = data?.data?.me?.courses || [];

    // Set initial selected value
    trackSelect.value = initialTrack;

    // Store selection when changed
    trackSelect.addEventListener('change', () => {
      try {
        localStorage.setItem('apollo-odyssey-selected-track', trackSelect.value);
      } catch {
        // Silently fail if storage is not available
      }
      renderTrackCourses(trackSelect.value as TrackName, userCourses);
    });

    // Initial render
    renderTrackCourses(initialTrack, userCourses);
  })
  .catch(() => {
    widget.innerHTML = `
      <strong style="${styles.header}">${mergedConfig.icons.notStarted} ${mergedConfig.text.error}</strong>
      <p style="margin-top: 10px;">${mergedConfig.text.loginPrompt} 
        <a href="https://www.apollographql.com/tutorials/" style="${styles.link}">apollographql.com</a>
      </p>
    `;
  });
}

// Safely initialize widget
try {
  if (typeof window !== 'undefined') {
    createWidget();
  }
} catch (error) {
  console.error('Failed to initialize widget:', error);
} 