import { WidgetConfig } from './types';
import { createStyles } from './styles';

export function createTemplates(config: WidgetConfig) {
  const styles = createStyles(config);
  
  return {
    loading: '<strong style="font-size:16px;">🚀 Loading...</strong>',
    
    trackHeader: (isCompleted: boolean, trackStatus: string) => `
      <strong style="${styles.header}">
        ${isCompleted ? config.icons.trackCompleted : config.icons.track} 
        Apollo Odyssey Course Progress
        ${trackStatus}
      </strong>
    `,

    courseItem: (title: string, url: string, statusText: string, statusStyle: string) => `
      <li style="${styles.listItem}">
        <a href="${url}" style="${styles.link}">
          <strong>${title}</strong>
        </a>: <span style="${statusStyle}">${statusText}</span>
      </li>
    `,

    loginPrompt: () => `
      <strong style="${styles.header}">
        ${config.icons.notStarted} ${config.text.error}
      </strong>
      <p style="margin-top: 10px;">
        ${config.text.loginPrompt} 
        <a href="https://www.apollographql.com/tutorials/" style="${styles.link}">
          apollographql.com
        </a>
      </p>
    `,

    refreshButton: (isLoading: boolean, lastUpdated?: Date) => `
      <button 
        id="refresh-btn"
        style="${styles.refreshButton}"
        ${isLoading ? 'disabled' : ''}
      >
        ${isLoading ? '🔄 Refreshing...' : '🔄 Refresh'}
        ${lastUpdated ? `
          <span style="font-size: 12px; opacity: 0.7;">
            Updated ${lastUpdated.toLocaleTimeString()}
          </span>
        ` : ''}
      </button>
    `
  };
} 