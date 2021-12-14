import * as vscode from "vscode";
import { Commands } from "../commands";
import { Group, Project } from "../models/types";
import { GroupService } from "../services/group.service";
import { ProjectService } from "../services/project.service";
import {
  CREATE_PROJECT,
  DASHBOARD_VIEW_ID,
  DELETE_GROUP,
  DELETE_PROJECT,
  OPEN_PROJECT,
  UPDATE_GROUP,
  UPDATE_PROJECT,
} from "./consts";
import { deleteIcon, editIcon } from "./icons";
import { getUri } from "./util";

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private readonly groupService: GroupService;
  private readonly projectService: ProjectService;
  private readonly commands: Commands;

  private constructor(panel: vscode.WebviewPanel, private readonly extensionUri: vscode.Uri, deps: any) {
    this._panel = panel;
    this._panel.onDidDispose(this.dispose, null, this._disposables);
    this._setWebviewMessageListener(this._panel.webview);

    this.groupService = deps.groupService;
    this.projectService = deps.projectService;
    this.commands = deps.commands;
  }

  public async setContent() {
    this._panel.webview.html = await this._getWebviewContent(this._panel.webview, this.extensionUri);
  }

  public static async render(extensionUri: vscode.Uri, deps: any) {
    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(DASHBOARD_VIEW_ID, "Dashboard", vscode.ViewColumn.One, {
        enableScripts: true,
      });

      DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri, deps);
      await DashboardPanel.currentPanel.setContent();
    }
  }

  public dispose() {
    DashboardPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private async _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const scriptUri = getUri(webview, extensionUri, ["media", "dashboardScript.js"]);
    const stylesUri = getUri(webview, extensionUri, ["media", "style.css"]);
    const codiconsUri = getUri(webview, extensionUri, ["node_modules", "@vscode/codicons", "dist", "codicon.css"]);

    const toolkitUri = getUri(webview, extensionUri, [
      "node_modules",
      "@vscode",
      "webview-ui-toolkit",
      "dist",
      "toolkit.js",
    ]);

    // dont call services here, put this into state
    const groups = await this.groupService.findAll();

    const getGroupProjects = async (group: Group) => {
      const projects = await this.projectService.findAll();
      return projects.filter(project => group.projects.includes(project.id));
    };

    const renderGroup = async (group: Group): Promise<string> => {
      return /*html*/ `
      <div class="group" id="${group.id}">
        <div class="group-name" >
        <div>${group.name}</div>  
          <div>
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
          ${(await getGroupProjects(group)).map(renderProject).join("")}
          ${renderAddProject(group.id)}
        </div>

      </div>
    `;
    };

    const renderProject = (project: Project) => {
      return /*html*/ `
        <div class="project" id="${project.id}" data-id="${project.id}">     
          <div>    
          <vscode-badge style="--badge-background: ${project.color}"></vscode-badge>
          <span class="project-name">
            ${project.name}
          </span>
          <span class="project-path">
            ${project.path}
          </span>
          </div>
          <div class="icons">
            <vscode-button class="update-project" appearance="icon" aria-label="Edit" data-id="${project.id}">
              <span class="codicon codicon-edit" />
            </vscode-button>
            <vscode-button class="delete-project" appearance="icon" aria-label="Remove" data-id="${project.id}">
              <span class="codicon codicon-close" />
            </vscode-button>
          </div>
        </div>
        `;

      // <h3 style="border-color: ${project.color}">${project.name}</h3>
      //   <div class="icons">
      //   <vscode-button class="update-project" appearance="icon" aria-label="Edit" data-id="${project.id}">
      //     <span class="codicon codicon-edit" />
      //   </vscode-button>
      //   <vscode-button class="delete-project" appearance="icon" aria-label="Remove" data-id="${project.id}">
      //     <span class="codicon codicon-close" />
      //   </vscode-button>
      // </div>
    };

    const renderAddProject = (groupId: string) => {
      return /*html*/ `
      <vscode-button class="create-project icon"  aria-label="Add" data-id="${groupId}">
        + Add project       
      </vscode-button>
    `;
    };

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <script type="module" src="${toolkitUri}"></script>
        <script type="module" src="${scriptUri}"></script>
        <link href="${codiconsUri}" rel="stylesheet" />
        <link href="${stylesUri}" rel="stylesheet" />
      </head>
      <body>
        <h1>Dashboard</h1>
        ${(await Promise.all(groups.map(renderGroup))).join("")}      </body>
    </html>
    `;
  }

  //Switches are terrible, make a map of commands to functions
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const { command, payload } = message;
        switch (command) {
          case OPEN_PROJECT:
            await this.commands.openProject(payload);
            break;
          case DELETE_GROUP:
            await this.commands.deleteGroup(payload);
            break;
          case CREATE_PROJECT:
            await this.commands.createProject(payload);
            break;
          case DELETE_PROJECT:
            await this.commands.deleteProject(payload);
            break;
          case UPDATE_PROJECT:
            await this.commands.updateProject(payload);
            break;
          case UPDATE_GROUP:
            await this.commands.updateGroup(payload);
            break;
        }
        await DashboardPanel?.currentPanel?.setContent();
      },
      undefined,
      this._disposables
    );
  }
}
