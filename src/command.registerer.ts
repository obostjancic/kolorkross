import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import * as vscode from "vscode";
import { Commands } from "./commands";
import { cmd, token } from "./ui/consts";
import { DashboardPanel } from "./ui/DashboardPanel";

@injectable()
export class CommandRegisterer {
  constructor(
    @inject(Commands) private readonly commands: Commands,
    @inject(token.CONTEXT) private readonly context: vscode.ExtensionContext
  ) {}

  public register() {
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.OPEN_DASHBOARD, DashboardPanel.render));
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.CREATE_GROUP, this.commands.createGroup));
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.UPDATE_GROUP, this.commands.updateGroup));
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.DELETE_GROUP, this.commands.deleteGroup));
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.CREATE_PROJECT, this.commands.createProject));
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.UPDATE_PROJECT, this.commands.updateProject));
    this.context.subscriptions.push(vscode.commands.registerCommand(cmd.DELETE_PROJECT, this.commands.deleteProject));
  }
}
