import { Group, Project, UpdateGroupDTO } from "../models/types";
import { Repository } from "../repositories/base.repository";

export class GroupService {
  constructor(private repo: Repository<Group>) {}

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

  async create(group: Group): Promise<Group> {
    const alreadyExistingGroup = this.repo.findById(group.id);
    if (alreadyExistingGroup) {
      throw new Error("Group already exists");
    }
    return this.repo.create(group);
  }

  async update(updateData: UpdateGroupDTO): Promise<Group> {
    const group = await this.findById(updateData.id);
    const updatedGroup = await this.repo.update(updateData.id, { ...group, ...updateData });
    return updatedGroup;
  }

  async delete(group: Group): Promise<void> {
    this.repo.delete(group.id);
  }

  async addProject(project: Project, group: Group): Promise<void> {
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
