import { WorkspaceConfiguration } from "vscode";
import { Color, Project } from "../models/types";
import { ColorService } from "../services/color.service";
import { matcher, Repository } from "./base.repository";

export class ProjectRepository implements Repository<Project> {
  private readonly config: WorkspaceConfiguration;
  private readonly section = "dash.projects";
  constructor(config: WorkspaceConfiguration) {
    this.config = config;
  }

  private readProjectConfig(): Project[] {
    return this.config.get(this.section) || [];
  }

  private async writeProjectConfig(data: any) {
    this.config.update(this.section, data, true);
  }

  private async writeWorkspaceConfig(data: any) {
    this.config.update("workbench.colorCustomizations", data, 2);
  }

  public async updateWorkspaceConfig(color: Color): Promise<void> {
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
    return this.readProjectConfig().find((g: Project) => g.id === id);
  }

  findAll(): Project[] {
    return this.readProjectConfig();
  }

  find(query: Partial<Project>): Project[] {
    return this.readProjectConfig().filter(p => matcher(p, query));
  }

  async create(project: Project): Promise<Project> {
    await this.writeProjectConfig([...this.readProjectConfig(), project]);
    return project;
  }

  async update(id: string, updateData: Partial<Project>): Promise<Project> {
    const project = this.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    const updatedProject = { ...project, ...updateData };
    const otherProjects = this.readProjectConfig().filter(p => p.id !== id);
    await this.writeProjectConfig([...otherProjects, updatedProject]);
    await this.updateWorkspaceConfig(updatedProject.color);
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    const otherProjects = this.readProjectConfig().filter(p => p.id !== id);
    await this.writeProjectConfig(otherProjects);
  }
}
