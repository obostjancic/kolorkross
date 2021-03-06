import { Project } from "../../models/types";

export const project = (project: Project, groupId?: string) => {
  return /*html*/ `
    <div class="project" id="${project.id}" data-id="${project.id}" data-name="${project.name}">     
      <div>    
      <vscode-badge style="--badge-background: ${project.color.value}"></vscode-badge>
      <span class="project-name">
        ${project.name}
      </span>
      <span class="project-path">
        ${project.path}
      </span>
      </div>
      <div class="project-actions">
        <div class="move-project">
          <vscode-button class="move-project-up" appearance="icon" aria-label="Edit"  data-group-id="${groupId}" data-id="${project.id}">
            <span class="codicon codicon-arrow-up" />
          </vscode-button>
          <vscode-button class="move-project-down" appearance="icon" aria-label="Edit" data-group-id="${groupId}" data-id="${project.id}">
            <span class="codicon codicon-arrow-down" />
          </vscode-button>
        </div>
        <vscode-button class="update-project" appearance="icon" aria-label="Edit" data-id="${project.id}">
          <span class="codicon codicon-edit" />
        </vscode-button>
        <vscode-button class="delete-project" appearance="icon" aria-label="Remove" data-id="${project.id}">
          <span class="codicon codicon-close" />
        </vscode-button>
      </div>
    </div>
    `;
};

export const addProject = (groupId: string) => {
  return /*html*/ `
  <vscode-button class="create-project icon" appearance="icon" aria-label="Add" data-id="${groupId}">
    Add project   
    <span slot="start" class="codicon codicon-add"></span>    
  </vscode-button>
`;
};
