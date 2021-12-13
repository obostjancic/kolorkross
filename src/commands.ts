import * as vscode from "vscode";
import { Color } from "./models/types";
import { GroupService } from "./services/group.service";
import { ProjectService } from "./services/project.service";

export class Commands {
  constructor(private projectService: ProjectService, private groupService: GroupService) {
    this.openProject = this.openProject.bind(this);
    this.createProject = this.createProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
  }

  public async openProject(projectId?: string): Promise<void> {
    projectId = projectId || (await this.input("Project Id"));
    if (!projectId) {
      return;
    }
    const project = await this.projectService.findById(projectId);
    vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(project.path), false);
  }

  public async createProject(groupId?: string): Promise<void> {
    const projectPath = await this.input("Project Path");
    if (!projectPath) {
      return this.output("No project path provided");
    }
    groupId = groupId || (await this.input("Group Id", "", false));
    const newProject = await this.projectService.create({ path: projectPath });
    if (groupId) {
      const group = await this.groupService.findById(groupId);
      this.groupService.createProject(newProject, group);
    }
  }

  public async updateProject(projectId?: string): Promise<void> {
    projectId = projectId || (await this.input("Project Id"));
    if (!projectId) {
      return;
    }
    const project = await this.projectService.findById(projectId);
    const newName = await this.input("Project Name", project.name);
    const newColor = (await this.input("Project Color", project.color)) as Color;
    const newPath = await this.input("Project Path", project.path);

    await this.projectService.update({ ...project, name: newName, color: newColor, path: newPath });
  }

  public async deleteProject(projectId?: string): Promise<void> {
    projectId = projectId || (await this.input("Project Id"));
    if (!projectId) {
      return this.output("No project id provided");
    }
    const project = await this.projectService.findById(projectId);
    if (!(await this.confirm(`Are you sure you want to delete project ${project.name}?`))) {
      return;
    }
    await this.projectService.delete(project);
  }

  public async createGroup(): Promise<void> {
    const groupName = await this.input("Group Name");
    if (!groupName) {
      return this.output("No group name provided");
    }
    this.groupService.create({ name: groupName });
    // openDashboard();
  }

  public async updateGroup(groupId?: string): Promise<void> {
    groupId = groupId || (await this.input("Group Id"));
    if (!groupId) {
      return;
    }
    const group = await this.groupService.findById(groupId);
    const newName = await this.input("Group Name", group.name);
    const newColor = (await this.input("Group Color", group.color)) as Color;

    await this.groupService.update({ ...group, name: newName, color: newColor });
  }

  public async deleteGroup(groupId?: string): Promise<void> {
    groupId = groupId || (await this.input("Group Id", "", false));
    if (!groupId) {
      return this.output("No group id provided");
    }
    const group = await this.groupService.findById(groupId);
    if (!(await this.confirm(`Are you sure you want to delete group ${group.name}?`))) {
      return;
    }
    this.groupService.delete(group);
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

  private async output(text: string) {
    await vscode.window.showInformationMessage(text);
  }
}
