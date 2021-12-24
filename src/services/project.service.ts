import { inject, singleton } from "tsyringe";
import { CreateProjectDTO, Project, UpdateProjectDTO } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { ColorService } from "./color.service";

@singleton()
export class ProjectService {
  constructor(@inject(ProjectRepository) private readonly repo: Repository<Project>) {}

  async findById(id: string): Promise<Project> {
    const project = this.repo.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  async findByPath(path: string): Promise<Project> {
    const project = this.repo.find({ path })?.[0];
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  async findAll(): Promise<Project[]> {
    return this.repo.findAll();
  }

  async create(project: CreateProjectDTO): Promise<Project> {
    const color = project.color || ColorService.getRandomColor();
    const newProject = {
      path: project.path,
      color,
      //FIXME: are you sure this will work on every OS?
      name: project.name || project.path.split("/").pop(),
    };
    return this.repo.create(newProject);
  }

  async update(updateData: UpdateProjectDTO): Promise<Project> {
    const project = await this.findById(updateData.id);
    const updatedProject = await this.repo.update(updateData.id, { ...project, ...updateData });
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.repo.delete(id);
  }

  async deleteAll(): Promise<void> {
    const all = await this.findAll();
    for (const project of all) {
      await this.delete(project.id);
    }
  }
}
