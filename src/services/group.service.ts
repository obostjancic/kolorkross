import { inject, injectable } from "tsyringe";
import { CreateGroupDTO, Group, Project, UpdateGroupDTO } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { GroupRepository } from "../repositories/group.repository";

@injectable()
export class GroupService {
  constructor(@inject(GroupRepository) private readonly repo: Repository<Group>) {}

  async findById(id: string): Promise<Group> {
    const group = this.repo.findById(id);
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  }

  async findAll(): Promise<Group[]> {
    return this.repo.findAll();
  }

  async create(group: CreateGroupDTO): Promise<Group> {
    const newGroup = {
      name: group.name,
      projects: [],
    };
    return this.repo.create(newGroup);
  }

  async update(updateData: UpdateGroupDTO): Promise<Group> {
    const group = await this.findById(updateData.id);
    const updatedGroup = await this.repo.update(updateData.id, { ...group, ...updateData });
    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.repo.delete(id);
  }

  async createProject(project: Project, group: Group): Promise<void> {
    if (group.projects.find(p => p === project.id)) {
      throw new Error("Project already exists in group");
    }

    const groupWithProject = { ...group, projects: [...group.projects, project.id] };
    this.repo.update(group.id, groupWithProject);
  }

  async removeProject(project: Project, group: Group): Promise<void> {
    if (!group.projects.find(p => p === project.id)) {
      throw new Error("Project does not exist in group");
    }

    const groupWithoutProject = {
      ...group,
      projects: group.projects.filter(p => p !== project.id),
    };
    this.repo.update(group.id, groupWithoutProject);
  }
}
