import { inject, injectable } from "tsyringe";
import { Group, Project } from "../models/types";
import { GroupService } from "../services/group.service";
import { ProjectService } from "../services/project.service";

export type GroupWProject = Omit<Group, "projects"> & { projects: Project[] };

@injectable()
export class DashboardService {
  constructor(
    @inject(ProjectService) private readonly projectService: ProjectService,
    @inject(GroupService) private readonly groupService: GroupService
  ) {}

  public async getGroups(): Promise<GroupWProject[]> {
    const groups = await this.groupService.findAll();
    const projects = await this.projectService.findAll();
    const groupsWithProjects = await Promise.all(groups.map(g => this.getGroupWithProjects(g, projects)));

    return groupsWithProjects;
  }

  private async getGroupWithProjects(group: Group, projects: Project[]): Promise<GroupWProject> {
    return { ...group, projects: projects.filter(project => group.projects.includes(project.id)) };
  }
}
