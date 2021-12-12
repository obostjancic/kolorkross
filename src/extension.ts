// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Color } from "./models/types";
import { GroupRepository } from "./repositories/group.repository";
import { GroupService } from "./services/group.service";
import { ProjectRepository } from "./repositories/project.repository";
import { ProjectService } from "./services/project.service";

// TODO: Workspace <-> Project relation needs rethinking, update function cleanup
// TODO: Configuration access layer is needed

export const init = (config: vscode.WorkspaceConfiguration) => {
  const repo = new GroupRepository(config);
  const projRepo = new ProjectRepository(config);
  const groupService = new GroupService(repo);
  const projectService = new ProjectService(projRepo);

  return {
    groupService,
    projectService,
  };
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const getCurrentPath = () => vscode.workspace.workspaceFolders?.[0].uri.path;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "dash" is now active!');
  const config = vscode.workspace.getConfiguration();

  const { projectService, groupService } = init(config);

  const currentProject = await projectService.findByPath(`${getCurrentPath()}`);
  await projectService.applyConfig(currentProject);
  vscode.window.showInformationMessage(JSON.stringify(currentProject));

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  let disposable = vscode.commands.registerCommand("dash.listGroups", async () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    try {
      vscode.window.showInformationMessage(JSON.stringify(currentProject));
      await projectService.applyConfig(currentProject);

      // const gr = await groupService.findById("fountainGroup");
      // const proj = await projectService.findById("fountainProject");
      // await groupService.addProject(proj, gr);
      // await config.update("workbench.colorCustomizations", { "titleBar.activeBackground": "#ff0000" }, 2);
      vscode.window.showInformationMessage(JSON.stringify(groupService.findAll()));
    } catch (err) {
      console.log(err);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
