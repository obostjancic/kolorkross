import Container, { Service } from "typedi";
import { ProjectService } from "./project.service";
import { GroupService } from "./group.service";
import { ShowError, WindowService } from "./window.service";
import { WorkspaceConfigService } from "./workspaceConfig.service";
import { VSCode } from "../util/vscode.env";
import { ColorService } from "./color.service";
@Service()
export class CommandService {
  private readonly projectService: ProjectService = Container.get(ProjectService);
  private readonly groupService: GroupService = Container.get(GroupService);
  private readonly workspaceConfigService: WorkspaceConfigService = Container.get(WorkspaceConfigService);
  private readonly windowService: WindowService = Container.get(WindowService);

  constructor() {
    this.openProject = this.openProject.bind(this);
    this.createProject = this.createProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
  }

  // @ShowError()
  public async openProject(projectId?: string): Promise<void> {
    projectId = await this.windowService.validatedInput("Project Id", projectId);

    const project = await this.projectService.findById(projectId);
    VSCode.executeCommand("vscode.openFolder", VSCode.file(project.path), true);
  }

  @ShowError()
  public async createProject(groupId?: string): Promise<void> {
    groupId = await this.windowService.validatedInput("Group Id", groupId);
    const projectPath = await this.windowService.inputPath("Open");

    const newProject = await this.projectService.create({ path: projectPath });
    const group = await this.groupService.findById(groupId);
    this.groupService.createProject(newProject, group);
  }

  @ShowError()
  public async updateProject(projectId?: string): Promise<void> {
    projectId = await this.windowService.validatedInput("Project Id", projectId);

    const project = await this.projectService.findById(projectId);
    const name = await this.windowService.input("Project Name", project.name);
    const color = await this.windowService.inputColor(
      "Project Color",
      project.color.value,
      ColorService.getPredefinedColors()
    );
    const path = await this.windowService.inputPath("Update", project.path);

    const updatedProject = await this.projectService.update({
      ...project,
      name,
      color,
      path,
    });

    this.workspaceConfigService.applyConfigToWorkspace(updatedProject);
  }

  @ShowError()
  public async deleteProject(projectId?: string): Promise<void> {
    projectId = await this.windowService.validatedInput("Project Id", projectId);
    const project = await this.projectService.findById(projectId);
    if (!(await this.windowService.confirm(`Are you sure you want to delete project ${project.name}?`))) {
      return;
    }
    await this.projectService.delete(project.id);
  }

  @ShowError()
  public async createGroup(): Promise<void> {
    const groupName = await this.windowService.validatedInput("Group Name");
    this.groupService.create({ name: groupName });
  }

  @ShowError()
  public async updateGroup(groupId?: string): Promise<void> {
    groupId = await this.windowService.validatedInput("Group Id", groupId);
    const group = await this.groupService.findById(groupId);
    const newName = await this.windowService.input("Group Name", group.name);

    await this.groupService.update({ ...group, name: newName });
  }

  @ShowError()
  public async deleteGroup(groupId?: string): Promise<void> {
    groupId = await this.windowService.validatedInput("Group Id", groupId);
    const group = await this.groupService.findById(groupId);
    if (!(await this.windowService.confirm(`Are you sure you want to delete group ${group.name}?`))) {
      return;
    }
    this.groupService.delete(group.id);
  }
}
