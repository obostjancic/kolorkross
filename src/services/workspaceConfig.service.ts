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
    const { veryLight, light, medium, dark, veryDark } = ColorService.getPallete(color);
    this.writeWorkspaceConfig({
      "titleBar.activeBackground": ColorService.transparent(dark, 0.5).value,
      "titleBar.activeForeground": ColorService.transparent(veryLight, 0.75).value,
      "titleBar.inactiveBackground": ColorService.transparent(veryDark, 0.5).value,
      "titleBar.inactiveForeground": ColorService.transparent(light, 0.75).value,
      "activityBar.background": ColorService.transparent(medium, 0.5).value,
      "activityBar.foreground": ColorService.transparent(veryLight, 0.75).value,
      "statusBar.background": ColorService.transparent(dark, 0.5).value,
      "statusBar.foreground": ColorService.transparent(veryLight, 0.75).value,
    });
  }
}
