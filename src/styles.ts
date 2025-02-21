export function createStyles(config: any) {
  return {
    widget: `
      position: fixed;
      top: ${config.position.top};
      right: ${config.position.right};
      background: ${config.colors.background};
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 14px;
      z-index: 9999;
      width: ${config.width};
      border: 1px solid ${config.colors.border};
      line-height: 1.5;
      color: ${config.colors.text};
    `,
    dropdown: `
      margin: 10px 0;
      padding: 8px;
      border-radius: 5px;
      width: 100%;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid ${config.colors.border};
      background: ${config.colors.dropdownBg};
      appearance: auto;
    `,
    list: `
      margin: 0;
      padding-left: 20px;
      list-style: disc;
    `,
    listItem: `
      margin: 5px 0;
    `,
    link: `
      color: ${config.colors.primary};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    `,
    closeButton: `
      background: ${config.colors.primary};
      color: #fff;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      &:hover {
        opacity: 0.9;
      }
    `,
    buttonContainer: `
      text-align: right;
      margin-top: 15px;
    `,
    header: `
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    `,
    status: {
      notStarted: `
        color: ${config.colors.textMuted};
      `,
      inProgress: `
        color: ${config.colors.primary};
      `,
      completed: `
        color: ${config.colors.success};
      `
    },
    group: `
      margin-bottom: 15px;
      padding: 0 10px;
    `,
    groupHeader: `
      font-size: 14px;
      font-weight: bold;
      color: ${config.colors.primary};
      margin: 15px 0 5px 0;
    `,
    groupDescription: `
      font-size: 12px;
      color: ${config.colors.textMuted};
      margin: 0 0 10px 0;
    `,
    certGroup: `
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid ${config.colors.border};
      border-radius: 5px;
      background: ${config.colors.background};
    `,
    certHeader: `
      margin: 0 0 10px 0;
      font-size: 14px;
      color: ${config.colors.primary};
    `,
    certDescription: `
      font-size: 12px;
      color: ${config.colors.textMuted};
      margin: 5px 0;
    `,
    container: `
      padding: 15px;
      border-radius: 5px;
    `,
    completed: `
      background: ${config.colors.success}15;
      border: 1px solid ${config.colors.success};
    `
  };
} 