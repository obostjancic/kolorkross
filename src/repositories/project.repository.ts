import Container, { Service, Inject } from "typedi";
import { Memento } from "vscode";
import { Project } from "../models/types";
import { token } from "../util/constants";
import { id, matcher, Repository } from "./base.repository";

@Service()
export class ProjectRepository {
  private readonly section = "dash.projects";
  private readonly state: Memento = Container.get(token.GLOBAL_STATE);

  private readProjectConfig(): Record<string, Project> {
    return this.state.get(this.section) || {};
  }

  private async writeProjectConfig(data: Record<string, Project>): Promise<void> {
    this.state.update(this.section, data);
  }

  public findById(id: string): Project | undefined {
    return this.readProjectConfig()[id];
  }

  public findAll(): Project[] {
    return Object.values(this.readProjectConfig());
  }

  public find(query: Partial<Project>): Project[] {
    return this.findAll().filter(p => matcher(p, query));
  }

  public async create(project: Project): Promise<Project> {
    const newProject = { ...project, id: id() } as Project;

    const currentConfig = this.readProjectConfig();
    await this.writeProjectConfig({ ...currentConfig, [newProject.id]: newProject });
    return newProject;
  }

  public async update(id: string, updateData: Partial<Project>): Promise<Project> {
    const project = this.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    const updatedProject = { ...project, ...updateData };
    const currentConfig = this.readProjectConfig();
    await this.writeProjectConfig({ ...currentConfig, [project.id]: updatedProject });
    // await this.updateWorkspaceConfig(updatedProject.color);
    return updatedProject;
  }

  public async delete(id: string): Promise<void> {
    const { [id]: _, ...newConfig } = this.readProjectConfig();
    await this.writeProjectConfig(newConfig);
  }
}
