export const header = () => {
  return /*html*/ `
  <div class="header">
    <div class="header-title">
      <span class="codicon codicon-dashboard"></span>
      <span>Dashboard</span>
    </div>
    <div class="header-actions">
      <div class="header-search">
        <vscode-text-field placeholder="Search...">
          <span slot="start" class="codicon codicon-search"></span>
        </vscode-text-field>
      </div>
      <div class="header-add">
          <vscode-button class="create-group icon" appearance="icon" aria-label="Add">
            Add group
            <span slot="start" class="codicon codicon-add"></span>
          </vscode-button>
        </div>
      </div>
    </div>
  </div>
  `;
};
