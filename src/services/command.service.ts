import { inject, injectable } from "tsyringe";
import * as vscode from "vscode";
import { Color } from "../models/types";
import { GroupService } from "./group.service";
import { ProjectService } from ".//project.service";
import { WorkspaceConfigService } from "./workspaceConfig.service";
import { isValidHex } from "../util/validators";
import { Catch } from "../util/decorators";

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShowError = () =>
  Catch((error: Error) => {
    vscode.window.showErrorMessage(error.message);
  });

@injectable()
export class CommandService {
  constructor(
    @inject(ProjectService) private readonly projectService: ProjectService,
    @inject(GroupService) private readonly groupService: GroupService,
    @inject(WorkspaceConfigService) private readonly workspaceConfigService: WorkspaceConfigService
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
    groupId = await this.validatedInput("Group Id", groupId);
    const projectPath = await this.inputPath("Open");

    const newProject = await this.projectService.create({ path: projectPath });
    const group = await this.groupService.findById(groupId);
    this.groupService.createProject(newProject, group);
  }

  @ShowError()
  public async updateProject(projectId?: string): Promise<void> {
    projectId = await this.validatedInput("Project Id", projectId);

    const project = await this.projectService.findById(projectId);
    const name = await this.input("Project Name", project.name);
    const color = await this.inputColor("Project Color", project.color);
    const path = await this.inputPath("Update", project.path);

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
    const groupName = await this.validatedInput("Group Name");
    this.groupService.create({ name: groupName });
  }

  @ShowError()
  public async updateGroup(groupId?: string): Promise<void> {
    groupId = await this.validatedInput("Group Id", groupId);
    const group = await this.groupService.findById(groupId);
    const newName = await this.input("Group Name", group.name);

    await this.groupService.update({ ...group, name: newName });
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

  private async input(name: string, defaultValue: string = "", validateInput?: any): Promise<string | undefined> {
    return await vscode.window.showInputBox({
      placeHolder: name,
      ignoreFocusOut: true,
      value: defaultValue,
      validateInput,
    });
  }

  private async inputColor(name: string, defaultValue: string = ""): Promise<Color> {
    return (await this.input(name, defaultValue, (val: string) =>
      isValidHex(val) ? "" : "Invalid hex color"
    )) as Color;
  }

  private async inputPath(label: string, defaultValue: string = ""): Promise<string> {
    const uri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: label,
      defaultUri: vscode.Uri.parse(defaultValue),
    });
    const result = uri?.[0].path;
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  private async confirm(text: string): Promise<boolean> {
    const answer = await vscode.window.showInformationMessage(text, ...["Yes", "No"]);
    return answer === "Yes";
  }
}
