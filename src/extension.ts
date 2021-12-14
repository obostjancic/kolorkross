// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Commands } from "./commands";
import { GroupRepository } from "./repositories/group.repository";
import { ProjectRepository } from "./repositories/project.repository";
import { GroupService } from "./services/group.service";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { dashboardContent } from "./ui/dashboard";

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

export const init = async (context: vscode.ExtensionContext) => {
  const getCurrentPath = () => vscode.workspace.workspaceFolders?.[0].uri.path ?? "";

  const groupService = new GroupService(new GroupRepository(context.globalState));
  const projectService = new ProjectService(new ProjectRepository(context.globalState));
  const configService = new WorkspaceConfigService(vscode.workspace.getConfiguration(), getCurrentPath());

  configService.applyConfigToWorkspace(await projectService.findByPath(getCurrentPath()));

  const commands = new Commands(projectService, groupService, configService);

  return {
    commands,
    groupService,
    projectService,
  };
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

class DashboardSerializer implements vscode.WebviewPanelSerializer {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
    console.log(`Got state: ${state}`);
    const { groupService, projectService } = state;

    webviewPanel.webview.html = await dashboardContent(
      groupService,
      projectService,
      this.context,
      webviewPanel.webview
    ); //dashboardContent();
  }
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "dash" is now active!');

  const { groupService, projectService, commands } = await init(context);
  const serializer = new DashboardSerializer(context);
  let panel: vscode.WebviewPanel;

  const openDashboard = () => {
    panel = vscode.window.createWebviewPanel(DASHBOARD_VIEW_ID, "Dashboard", vscode.ViewColumn.One, {
      enableScripts: true,
    });
    eventHandler(panel.webview);
    renderDashboard();
  };

  const renderDashboard = async () => {
    serializer.deserializeWebviewPanel(panel, { groupService, projectService });
  };

  const eventHandler = (webview: vscode.Webview) =>
    webview.onDidReceiveMessage(async (e: any) => {
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
      renderDashboard();
    });

  const provider = new SidebarDummyDashboardViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));
  vscode.window.registerWebviewPanelSerializer(DASHBOARD_VIEW_ID, serializer);

  registerCommands();
  function registerCommands() {
    context.subscriptions.push(vscode.commands.registerCommand(OPEN_DASHBOARD, openDashboard));
    context.subscriptions.push(vscode.commands.registerCommand(CREATE_GROUP, commands.createGroup));
    context.subscriptions.push(vscode.commands.registerCommand(UPDATE_GROUP, commands.updateGroup));
    context.subscriptions.push(vscode.commands.registerCommand(DELETE_GROUP, commands.deleteGroup));
    context.subscriptions.push(vscode.commands.registerCommand(CREATE_PROJECT, commands.createProject));
    context.subscriptions.push(vscode.commands.registerCommand(UPDATE_PROJECT, commands.updateProject));
    context.subscriptions.push(vscode.commands.registerCommand(DELETE_PROJECT, commands.deleteProject));
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
