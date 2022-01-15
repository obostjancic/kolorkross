import { inject, singleton } from "tsyringe";
import { CreateGroupDTO, Group, Project, UpdateGroupDTO } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { GroupRepository } from "../repositories/group.repository";
import { Direction } from "../util/constants";

@singleton()
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
    const groups = this.repo.findAll();
    return groups.sort((a, b) => a.order - b.order);
  }

  async countAll(): Promise<number> {
    const groups = this.repo.findAll();
    return groups.length;
  }

  async create(group: CreateGroupDTO): Promise<Group> {
    const newGroup = {
      name: group.name,
      projects: [],
      order: await this.countAll(),
    };
    return this.repo.create(newGroup);
  }

  async update(updateData: UpdateGroupDTO): Promise<Group> {
    const group = await this.findById(updateData.id);
    const updatedGroup = await this.repo.update(updateData.id, { ...group, ...updateData });
    return updatedGroup;
  }

  async updateOrder(groupId: string, direction: Direction): Promise<void> {
    const groupCount = await this.countAll();
    const group = await this.findById(groupId);

    if (group.order === 0 && direction === Direction.up) {
      throw new Error("Cannot move group up");
    } else if (group.order === groupCount - 1 && direction === Direction.down) {
      throw new Error("Cannot move group down");
    }

    const newGroupOrder = group.order + (direction === Direction.up ? -1 : 1);
    const groupToSwapWith = await this.repo.findOne({ order: newGroupOrder });
    if (!groupToSwapWith) {
      throw new Error("Group to swap with not found");
    }

    await this.update({ ...groupToSwapWith, order: group.order });
    await this.update({ ...group, order: newGroupOrder });
  }

  async updateProjectOrder(groupId: string, projectId: string, direction: Direction): Promise<void> {
    const group = await this.findById(groupId);
    const projectIndex = group.projects.findIndex(p => p === projectId);
    if (projectIndex === -1) {
      throw new Error("Project not found in group");
    }

    const newProjectIndex = projectIndex + (direction === Direction.up ? -1 : 1);
    if (newProjectIndex < 0) {
      throw new Error("Cannot move project up");
    } else if (newProjectIndex > group.projects.length - 1) {
      throw new Error("Cannot move project down");
    }

    const projects = [...group.projects];
    const temp = projects[newProjectIndex];
    projects[newProjectIndex] = projects[projectIndex];
    projects[projectIndex] = temp;

    await this.update({ ...group, projects });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.repo.delete(id);
  }

  async deleteAll(): Promise<void> {
    const groups = await this.findAll();
    groups.forEach(group => this.repo.delete(group.id));
  }

  async addProject(group: Group, project: Project): Promise<void> {
    group = await this.findById(group.id);
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
