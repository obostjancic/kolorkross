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

// TODO: Workspace <-> Project relation needs rethinking, update function cleanup
// TODO: Configuration access layer is needed

const OPEN_DASHBOARD = "dash.openDashboard";
const LIST_GROUPS = "dash.listGroups";
const DASHBOARD_VIEW_ID = "dash.dashboard";

export const init = (config: vscode.WorkspaceConfiguration) => {
  const repo = new GroupRepository(config);
  const projRepo = new ProjectRepository(config);
  const groupService = new GroupService(repo);
  const projectService = new ProjectService(projRepo);

  return {
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

  const config = vscode.workspace.getConfiguration();
  const { groupService, projectService } = init(config);
  applyConfigToWorkspace(projectService);

  const openDashboard = async () => {
    const panel = vscode.window.createWebviewPanel(DASHBOARD_VIEW_ID, "Dashboard", vscode.ViewColumn.One, {
      enableScripts: true,
    });
    panel.webview.html = await dashboardContent(groupService, projectService, context, panel.webview);

    panel.webview.onDidReceiveMessage(async e => {
      console.log(e);
      switch (e.type) {
        case "open-project":
          openFolder((await projectService.findById(e.projectId)).path);
      }
    });
  };

  const openFolder = async (path: string) => {
    console.log("opening folder", path);
    vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(path), false);
  };

  const listGroups = async () => {
    try {
      // vscode.window.showInformationMessage(JSON.stringify(currentProject));
      // await projectService.applyConfig(currentProject);
      // const gr = await groupService.findById("fountainGroup");
      // const proj = await projectService.findById("fountainProject");
      // await groupService.addProject(proj, gr);
      // await config.update("workbench.colorCustomizations", { "titleBar.activeBackground": "#ff0000" }, 2);
      // vscode.window.showInformationMessage(JSON.stringify(groupService.findAll()));
      // vscode.window.showInformationMessage("hello");
    } catch (err) {
      console.log(err);
    }
  };

  context.subscriptions.push(vscode.commands.registerCommand(OPEN_DASHBOARD, openDashboard));
  context.subscriptions.push(vscode.commands.registerCommand(LIST_GROUPS, listGroups));

  const provider = new SidebarDummyDashboardViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));
}

// this method is called when your extension is deactivated
export function deactivate() {}
