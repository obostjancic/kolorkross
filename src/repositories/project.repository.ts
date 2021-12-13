import { Memento, WorkspaceConfiguration } from "vscode";
import { Color, Project } from "../models/types";
import { ColorService } from "../services/color.service";
import { id, matcher, Repository } from "./base.repository";

export class ProjectRepository implements Repository<Project> {
  private readonly state: Memento;
  private readonly workspaceConfig: WorkspaceConfiguration;
  private readonly section = "dash.projects";
  constructor(state: Memento, workspaceConfig: WorkspaceConfiguration) {
    this.state = state;
    this.workspaceConfig = workspaceConfig;
  }

  private readProjectConfig(): Record<string, Project> {
    return this.state.get(this.section) || {};
  }

  private async writeProjectConfig(data: Record<string, Project>): Promise<void> {
    this.state.update(this.section, data);
  }

  private async writeWorkspaceConfig(data: any) {
    this.workspaceConfig.update("workbench.colorCustomizations", data, 2);
  }

  public async updateWorkspaceConfig(color: Color): Promise<void> {
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

  findById(id: string): Project | undefined {
    return this.readProjectConfig()[id];
  }

  findAll(): Project[] {
    return Object.values(this.readProjectConfig());
  }

  find(query: Partial<Project>): Project[] {
    return this.findAll().filter(p => matcher(p, query));
  }

  async create(project: Project): Promise<Project> {
    const newProject = { ...project, id: id() } as Project;

    const currentConfig = this.readProjectConfig();
    await this.writeProjectConfig({ ...currentConfig, [newProject.id]: newProject });
    return newProject;
  }

  async update(id: string, updateData: Partial<Project>): Promise<Project> {
    const project = this.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    const updatedProject = { ...project, ...updateData };
    const currentConfig = this.readProjectConfig();
    await this.writeProjectConfig({ ...currentConfig, [project.id]: updatedProject });
    await this.updateWorkspaceConfig(updatedProject.color);
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    const { [id]: _, ...newConfig } = this.readProjectConfig();
    await this.writeProjectConfig(newConfig);
  }
}
