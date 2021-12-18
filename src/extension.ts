import "reflect-metadata";
import { Container, Token } from "typedi";
import * as vscode from "vscode";
import { CommandRegisterer } from "./command.registerer";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { SidebarDummyDashboardViewProvider } from "./ui/sidebar.view.provider";
import { DASHBOARD_VIEW_ID, token } from "./util/constants";

// TODO: ops - write a nice readme
// TODO: ops - lint
// TODO: ops - add tests for commands and workspaceConfigService
// TODO: ops - check the deployment/testing
// TODO: ops - Init git repo

// TODO: feat - project drag and drop
// TODO: feat - add search
// TODO: feat - add a better project update mechanism
// TODO: feat - add a color picker for the project

// TODO: fix - _dispose error

export const init = (context: vscode.ExtensionContext) => {
  Container.set(token.URI, context.extensionUri);
  Container.set(token.SUBSCRIPTIONS, context.subscriptions);
  Container.set(token.GLOBAL_STATE, context.globalState);
  Container.set(token.WORKSPACE_CONFIG, vscode.workspace.getConfiguration());
  Container.set(token.RUN_MODE, context.extensionMode);
  Container.set(token.CURRENT_PATH, vscode.workspace.workspaceFolders?.[0].uri.path ?? "");
};

const checkWorkspaceConfig = async () => {
  try {
    const currentPath = Container.get<string>(token.CURRENT_PATH);
    const projectService = Container.get<ProjectService>(ProjectService);
    const configService = Container.get<WorkspaceConfigService>(WorkspaceConfigService);
    configService.applyConfigToWorkspace(await projectService.findByPath(currentPath));
  } catch (e) {
    console.error("Project not part of config");
  }
};

export async function activate(context: vscode.ExtensionContext) {
  init(context);
  checkWorkspaceConfig();

  const provider = Container.get(SidebarDummyDashboardViewProvider);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));
  Container.get(CommandRegisterer).register();
}

export function deactivate() {}
