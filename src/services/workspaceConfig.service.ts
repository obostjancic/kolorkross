import Container, { Service } from "typedi";
import { WorkspaceConfiguration } from "vscode";
import { Color, Project } from "../models/types";
import { token } from "../util/constants";
import { ColorService } from "./color.service";

@Service()
export class WorkspaceConfigService {
  private readonly workspaceConfig: WorkspaceConfiguration = Container.get(token.WORKSPACE_CONFIG);
  private readonly currentPath: string = Container.get(token.CURRENT_PATH);

  private async writeWorkspaceConfig(data: any) {
    this.workspaceConfig.update("workbench.colorCustomizations", data, 2);
  }

  public async applyConfigToWorkspace(project: Project): Promise<void> {
    try {
      if (project.path === this.currentPath) {
        this.updateWorkspaceConfig(project.color);
      }
    } catch (err) {
      console.warn("Project not part of dashboard");
    }
  }

  private async updateWorkspaceConfig(color: Color): Promise<void> {
    if (!color) {
      return;
    }
    const { foreground, background } = ColorService.getPallete(color);
    this.writeWorkspaceConfig({
      "titleBar.activeBackground": background,
      "titleBar.activeForeground": foreground,
      "titleBar.inactiveBackground": background,
      "titleBar.inactiveForeground": foreground,
      "activityBar.background": background,
      "activityBar.foreground": foreground,
      "statusBar.background": background,
      "statusBar.foreground": foreground,
    });
  }
}
