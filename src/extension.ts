import "reflect-metadata";
import { container } from "tsyringe";
import * as vscode from "vscode";
import { CommandRegistrar } from "./command.registrar";
import { MigrationService } from "./services/migration.service";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { SidebarDummyDashboardViewProvider } from "./ui/sidebar.view.provider";
import { DASHBOARD_VIEW_ID, token } from "./util/constants";

// TODO: feat - add a better project update mechanism
// TODO: feat - project drag and drop

export const init = (context: vscode.ExtensionContext): void => {
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

const applyMigrations = async () => {
  const migrationsService = container.resolve(MigrationService);
  await migrationsService.run();
};

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  init(context);
  checkWorkspaceConfig();
  await applyMigrations();
  const provider = container.resolve(SidebarDummyDashboardViewProvider);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(DASHBOARD_VIEW_ID, provider));
  container.resolve(CommandRegistrar).register();
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}
