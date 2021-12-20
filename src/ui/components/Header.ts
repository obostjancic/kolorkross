export const header = () => {
  return /*html*/ `
  <div class="header">
    <div class="header-title">
    
    </div>
    <div class="header-actions">
      <div class="header-search">
        <vscode-text-field id="search-input" placeholder="Search..." autofocus>
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
