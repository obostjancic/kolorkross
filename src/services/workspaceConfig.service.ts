import { WorkspaceConfiguration } from "vscode";
import { Color, Project } from "../models/types";
import { ColorService } from "./color.service";

export class WorkspaceConfigService {
  constructor(private readonly workspaceConfig: WorkspaceConfiguration, private readonly currentPath: string) {}

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
    const cs = new ColorService();
    const { foreground, background } = cs.getPallete(color);
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
