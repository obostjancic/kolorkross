import "reflect-metadata";
import { container } from "tsyringe";
import * as vscode from "vscode";
import { CommandRegisterer } from "./command.registerer";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { DASHBOARD_VIEW_ID, token } from "./util/constants";
import { SidebarDummyDashboardViewProvider } from "./ui/sidebar.view.provider";

// TODO: go through, do cleanup stuff, deps
// TODO: add tests for commands and workspaceConfigService
// TODO: check the deployment/testing
// TODO: project drag and drop
// TODO: add search
export const init = (context: vscode.ExtensionContext) => {
  container.register(token.CONTEXT, { useValue: context });
  container.register(token.GLOBAL_STATE, { useValue: context.globalState });
  container.register(token.WORKSPACE_CONFIG, { useValue: vscode.workspace.getConfiguration() });
  container.register(token.CURRENT_PATH, { useValue: vscode.workspace.workspaceFolders?.[0].uri.path ?? "" });
};

const checkWorkspaceConfig = async () => {
  const currentPath = container.resolve<string>(token.CURRENT_PATH);
  const projectService = container.resolve(ProjectService);
  const configService = container.resolve(WorkspaceConfigService);

  configService.applyConfigToWorkspace(await projectService.findByPath(currentPath));
};

export async function activate(context: vscode.ExtensionContext) {
  init(context);
  checkWorkspaceConfig();

  const provider = container.resolve(SidebarDummyDashboardViewProvider);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));

  container.resolve(CommandRegisterer).register();
}

// this method is called when your extension is deactivated
export function deactivate() {}
