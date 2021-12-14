// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Commands } from "./commands";
import { GroupRepository } from "./repositories/group.repository";
import { ProjectRepository } from "./repositories/project.repository";
import { GroupService } from "./services/group.service";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import {
  CREATE_GROUP,
  CREATE_PROJECT,
  DASHBOARD_VIEW_ID,
  DELETE_GROUP,
  DELETE_PROJECT,
  OPEN_DASHBOARD,
  UPDATE_GROUP,
  UPDATE_PROJECT,
} from "./ui/consts";
// import { dashboardContent } from "./ui/dashboard";
import { DashboardPanel } from "./ui/DashboardPanel";
// TODO: Workspace <-> Project relation needs rethinking, update function cleanup
// TODO: Configuration access layer is needed

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

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "dash" is now active!');

  const { groupService, projectService, commands } = await init(context);
  const openDashboard = () => {
    DashboardPanel.render(context.extensionUri, { groupService, projectService, commands });
  };

  const provider = new SidebarDummyDashboardViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));

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
