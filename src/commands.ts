import * as vscode from "vscode";
import { Color } from "./models/types";
import { GroupService } from "./services/group.service";
import { ProjectService } from "./services/project.service";
import { WorkspaceConfigService } from "./services/workspaceConfig.service";
import { Catch } from "./util";

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShowError = () =>
  Catch((error: Error) => {
    vscode.window.showErrorMessage(error.message);
  });

export class Commands {
  constructor(
    private projectService: ProjectService,
    private groupService: GroupService,
    private workspaceConfigService: WorkspaceConfigService
  ) {
    this.openProject = this.openProject.bind(this);
    this.createProject = this.createProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
  }

  @ShowError()
  public async openProject(projectId?: string): Promise<void> {
    projectId = await this.validatedInput("Project Id", projectId);

    const project = await this.projectService.findById(projectId);
    vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(project.path), false);
  }

  @ShowError()
  public async createProject(groupId?: string): Promise<void> {
    const projectPath = await this.validatedInput("Project Path");
    groupId = await this.validatedInput("Group Id", groupId);

    const newProject = await this.projectService.create({ path: projectPath });
    const group = await this.groupService.findById(groupId);
    this.groupService.createProject(newProject, group);
  }

  @ShowError()
  public async updateProject(projectId?: string): Promise<void> {
    projectId = await this.validatedInput("Project Id", projectId);

    const project = await this.projectService.findById(projectId);
    const name = await this.input("Project Name", project.name);
    const color = (await this.input("Project Color", project.color)) as Color;
    const path = await this.input("Project Path", project.path);

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
    projectId = await this.validatedInput("Project Id", projectId);
    const project = await this.projectService.findById(projectId);
    if (!(await this.confirm(`Are you sure you want to delete project ${project.name}?`))) {
      return;
    }
    await this.projectService.delete(project);
  }

  @ShowError()
  public async createGroup(): Promise<void> {
    const groupName = await this.validatedInput("Group Id");

    this.groupService.create({ name: groupName });
    // openDashboard();
  }

  @ShowError()
  public async updateGroup(groupId?: string): Promise<void> {
    groupId = await this.validatedInput("Group Id", groupId);
    const group = await this.groupService.findById(groupId);
    const newName = await this.input("Group Name", group.name);
    const newColor = (await this.input("Group Color", group.color)) as Color;

    await this.groupService.update({ ...group, name: newName, color: newColor });
  }

  @ShowError()
  public async deleteGroup(groupId?: string): Promise<void> {
    groupId = await this.validatedInput("Group Id", groupId);
    const group = await this.groupService.findById(groupId);
    if (!(await this.confirm(`Are you sure you want to delete group ${group.name}?`))) {
      return;
    }
    this.groupService.delete(group.id);
  }

  private async validatedInput(label: string, value?: string): Promise<string> {
    const result = value || (await this.input(label));
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  private async input(name: string, defaultValue: string = "", required = true): Promise<string | undefined> {
    return await vscode.window.showInputBox({
      placeHolder: name,
      ignoreFocusOut: true,
      value: defaultValue,
      validateInput: (val: string) => (required ? (val ? "" : `A ${name} must be provided.`) : ""),
    });
  }

  private async confirm(text: string): Promise<boolean> {
    const answer = await vscode.window.showInformationMessage(text, ...["Yes", "No"]);
    return answer === "Yes";
  }
}
