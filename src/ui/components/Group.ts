import { GroupWProject } from "../dashboard.service";
import { addProject, project } from "./Project";

export const group = (group: GroupWProject): string => {
  return /*html*/ `
  <div class="group" id="${group.id}">
    <div class="group-name">
    <div>${group.name}</div>  
      <div class="group-actions">
        <div class="move-group">
          <vscode-button class="move-group-up" appearance="icon" aria-label="Edit" data-id="${group.id}">
            <span class="codicon codicon-arrow-up" />
          </vscode-button>
          <vscode-button class="move-group-down" appearance="icon" aria-label="Edit" data-id="${group.id}">
            <span class="codicon codicon-arrow-down" />
          </vscode-button>
        </div>
        <vscode-button class="update-group" appearance="icon" aria-label="Edit" data-id="${group.id}">
          <span class="codicon codicon-edit" />
        </vscode-button>
        <vscode-button class="delete-group" appearance="icon" aria-label="Remove" data-id="${group.id}">
          <span class="codicon codicon-close" />
        </vscode-button>
      </div>
    </div>
    <vscode-divider></vscode-divider>
    <div class="group-projects">
   
      ${group.projects.map(p => project(p, group.id)).join("")}
      ${addProject(group.id)}
    </div>

  </div>
`;
};
