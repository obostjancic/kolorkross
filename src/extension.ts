// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Color } from "./models/types";
import { GroupRepository } from "./repositories/group.repository";
import { GroupService } from "./services/group.service";
import { ProjectRepository } from "./repositories/project.repository";
import { ProjectService } from "./services/project.service";
import path = require("path");
import { readFile } from "fs/promises";
import { dashboardContent } from "./ui/dashboard";
import { ColorService } from "./services/color.service";
import { Commands } from "./commands";

// TODO: Workspace <-> Project relation needs rethinking, update function cleanup
// TODO: Configuration access layer is needed

const CREATE_GROUP = "dash.createGroup";
const UPDATE_GROUP = "dash.updateGroup";
const DELETE_GROUP = "dash.deleteGroup";

const OPEN_PROJECT = "dash.openProject";
const CREATE_PROJECT = "dash.createProject";
const UPDATE_PROJECT = "dash.updateProject";
const DELETE_PROJECT = "dash.deleteProject";

const OPEN_DASHBOARD = "dash.openDashboard";
const DASHBOARD_VIEW_ID = "dash.dashboard";

export const init = (context: vscode.ExtensionContext) => {
  const repo = new GroupRepository(context.globalState);
  const projRepo = new ProjectRepository(context.globalState, vscode.workspace.getConfiguration());
  const groupService = new GroupService(repo);
  const projectService = new ProjectService(projRepo);
  const commands = new Commands(projectService, groupService);

  return {
    commands,
    groupService,
    projectService,
  };
};

export const applyConfigToWorkspace = async (projectService: ProjectService): Promise<void> => {
  const getCurrentPath = () => vscode.workspace.workspaceFolders?.[0].uri.path ?? "";

  try {
    const currentProject = await projectService.findByPath(getCurrentPath());
    projectService.applyConfig(currentProject);
  } catch (err) {
    console.warn("Project not part of dashboard");
  }
};

class SidebarDummyDashboardViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    this._view = webviewView;
    // The only job of this "view" is to close itself and open the main project dashboard webview
    this.switchToMainDashboard();
    webviewView.onDidChangeVisibility(this.switchToMainDashboard);
  }

  switchToMainDashboard = () => {
    if (this._view?.visible) {
      vscode.commands.executeCommand("workbench.view.explorer");
      vscode.commands.executeCommand(OPEN_DASHBOARD);
    }
  };
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "dash" is now active!');

  // const config = vscode.workspace.getConfiguration();
  const { groupService, projectService, commands } = init(context);
  applyConfigToWorkspace(projectService);

  const openDashboard = async () => {
    const panel = vscode.window.createWebviewPanel(DASHBOARD_VIEW_ID, "Dashboard", vscode.ViewColumn.One, {
      enableScripts: true,
    });
    panel.webview.html = await dashboardContent(groupService, projectService, context, panel.webview);
    eventHandler(panel.webview);
  };

  const eventHandler = (webview: vscode.Webview) =>
    webview.onDidReceiveMessage(async (e: any) => {
      console.group(e.type);
      switch (e.type) {
        case OPEN_PROJECT:
          await commands.openProject(e.payload);
          break;
        case DELETE_GROUP:
          await commands.deleteGroup(e.payload);
          break;
        case CREATE_PROJECT:
          await commands.createProject(e.payload);
          break;
        case DELETE_PROJECT:
          await commands.deleteProject(e.payload);
          break;
        case UPDATE_PROJECT:
          await commands.updateProject(e.payload);
          break;
        case UPDATE_GROUP:
          await commands.updateGroup(e.payload);
          break;
      }
      openDashboard();
    });

  const provider = new SidebarDummyDashboardViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));
  // vscode.window.registerWebviewPanelSerializer(DASHBOARD_VIEW_ID, new DashboardSerializer());

  registerCommands();
  function registerCommands() {
    context.subscriptions.push(vscode.commands.registerCommand(OPEN_DASHBOARD, openDashboard));
    context.subscriptions.push(vscode.commands.registerCommand(CREATE_GROUP, commands.createGroup));
    context.subscriptions.push(vscode.commands.registerCommand(DELETE_GROUP, commands.deleteGroup));
    context.subscriptions.push(vscode.commands.registerCommand(CREATE_PROJECT, commands.createProject));
    context.subscriptions.push(vscode.commands.registerCommand(DELETE_PROJECT, commands.deleteProject));
  }
}

class DashboardSerializer implements vscode.WebviewPanelSerializer {
  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
    // `state` is the state persisted using `setState` inside the webview
    console.log(`Got state: ${state}`);

    // Restore the content of our webview.
    //
    // Make sure we hold on to the `webviewPanel` passed in here and
    // also restore any event listeners we need on it.
    webviewPanel.webview.html = "CONTENT"; //dashboardContent();
  }
}
// this method is called when your extension is deactivated
export function deactivate() {}
