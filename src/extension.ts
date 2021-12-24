import "reflect-metadata";
import { container } from "tsyringe";
import * as vscode from "vscode";
import { CommandRegisterer } from "./command.registerer";
import { ProjectRepository } from "./repositories/project.repository";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { SidebarDummyDashboardViewProvider } from "./ui/sidebar.view.provider";
import { DASHBOARD_VIEW_ID, token } from "./util/constants";

// TODO: ops - write a nice readme
// TODO: ops - add tests for commands

// TODO: feat - add a better project update mechanism
// TODO: feat - project drag and drop

// TODO: fix - _dispose error

export const init = (context: vscode.ExtensionContext) => {
  container.register(token.URI, { useValue: context.extensionUri });
  container.register(token.SUBSCRIPTIONS, { useValue: context.subscriptions });
  container.register(token.GLOBAL_STATE, { useValue: context.globalState });
  container.register(token.WORKSPACE_CONFIG, { useValue: vscode.workspace.getConfiguration() });
  container.register(token.RUN_MODE, { useValue: context.extensionMode });
  container.register(token.CURRENT_PATH, { useValue: vscode.workspace.workspaceFolders?.[0].uri.path ?? "" });
};

const checkWorkspaceConfig = async () => {
  try {
    const currentPath = container.resolve<string>(token.CURRENT_PATH);
    const projectService = container.resolve<ProjectService>(ProjectService);
    const configService = container.resolve<WorkspaceConfigService>(WorkspaceConfigService);
    configService.applyConfigToWorkspace(await projectService.findByPath(currentPath));
  } catch (e) {
    console.error("Project not part of config");
  }
};

export async function activate(context: vscode.ExtensionContext) {
  init(context);
  checkWorkspaceConfig();

  const provider = container.resolve(SidebarDummyDashboardViewProvider);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));
  container.resolve(CommandRegisterer).register();
}

export function deactivate() {}
