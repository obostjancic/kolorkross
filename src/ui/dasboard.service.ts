import { inject, singleton } from "tsyringe";
import { Group, Project } from "../models/types";
import { CommandService } from "../services/command.service";
import { GroupService } from "../services/group.service";
import { ProjectService } from "../services/project.service";
import { cmd } from "../util/constants";

export type GroupWProject = Omit<Group, "projects"> & { projects: Project[] };

export type EventMessage = {
  command: typeof cmd;
  payload: any;
};
@singleton()
export class DashboardService {
  constructor(
    @inject(ProjectService) private readonly projectService: ProjectService,
    @inject(GroupService) private readonly groupService: GroupService,
    @inject(CommandService) private readonly cmdService: CommandService
  ) {}

  private readonly eventCmdMap = {
    [cmd.OPEN_PROJECT]: this.cmdService.openProject,
    [cmd.DELETE_GROUP]: this.cmdService.deleteGroup,
    [cmd.CREATE_GROUP]: this.cmdService.createGroup,
    [cmd.CREATE_PROJECT]: this.cmdService.createProject,
    [cmd.DELETE_PROJECT]: this.cmdService.deleteProject,
    [cmd.UPDATE_PROJECT]: this.cmdService.updateProject,
    [cmd.UPDATE_GROUP]: this.cmdService.updateGroup,
  };

  public async handleCommand(command: typeof cmd, payload: any) {
    //@ts-expect-error - bc typeof cmd cant be used as index
    return this.eventCmdMap[command](payload);
  }

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
