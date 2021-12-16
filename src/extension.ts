import "reflect-metadata";
import { Container, Token } from "typedi";
import * as vscode from "vscode";
import { CommandRegisterer } from "./command.registerer";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { SidebarDummyDashboardViewProvider } from "./ui/sidebar.view.provider";
import { DASHBOARD_VIEW_ID, token } from "./util/constants";
// const Container = {
//   set: (key: string, value: any) => {},
//   get: (key: string): any => {
//     return key;
//   },
// };
// TODO: add tests for commands and workspaceConfigService
// TODO: check the deployment/testing
// TODO: project drag and drop
// TODO: add search
export const init = (context: vscode.ExtensionContext) => {
  Container.set(token.URI, context.extensionUri);
  Container.set(token.SUBSCRIPTIONS, context.subscriptions);
  Container.set(token.GLOBAL_STATE, context.globalState);
  Container.set(token.WORKSPACE_CONFIG, vscode.workspace.getConfiguration());
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

// this method is called when your extension is deactivated
export function deactivate() {}
