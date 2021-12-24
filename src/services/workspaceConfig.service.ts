import { inject, singleton } from "tsyringe";
import { WorkspaceConfiguration } from "vscode";
import { Color, Project } from "../models/types";
import { token } from "../util/constants";
import { ColorService } from "./color.service";

@singleton()
export class WorkspaceConfigService {
  constructor(
    @inject(token.WORKSPACE_CONFIG) private readonly workspaceConfig: WorkspaceConfiguration,
    @inject(token.CURRENT_PATH) private readonly currentPath: string
  ) {}

  private async writeWorkspaceConfig(data: any) {
    this.workspaceConfig.update("workbench.colorCustomizations", data, 2);
  }

  public async applyConfigToWorkspace(project: Project): Promise<void> {
    if (project.path === this.currentPath) {
      this.updateWorkspaceConfig(project.color);
    }
  }

  private async updateWorkspaceConfig(color: Color): Promise<void> {
    const { foreground, background } = ColorService.getPallete(color);
    this.writeWorkspaceConfig({
      "titleBar.activeBackground": background.value,
      "titleBar.activeForeground": foreground.value,
      "titleBar.inactiveBackground": background.value,
      "titleBar.inactiveForeground": foreground.value,
      "activityBar.background": background.value,
      "activityBar.foreground": foreground.value,
      "statusBar.background": background.value,
      "statusBar.foreground": foreground.value,
    });
  }
}
