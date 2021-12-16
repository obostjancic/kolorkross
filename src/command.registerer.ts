import Container, { Service } from "typedi";
import * as vscode from "vscode";
import { CommandService } from "./services/command.service";
import { DashboardPanel } from "./ui/dasboard.panel";
import { cmd, token } from "./util/constants";

@Service()
export class CommandRegisterer {
  private readonly cmdService: CommandService = Container.get(CommandService);
  private readonly subs: any = Container.get(token.SUBSCRIPTIONS);

  public register() {
    this.subs.push(vscode.commands.registerCommand(cmd.OPEN_DASHBOARD, DashboardPanel.render));
    this.subs.push(vscode.commands.registerCommand(cmd.CREATE_GROUP, this.cmdService.createGroup));
    this.subs.push(vscode.commands.registerCommand(cmd.UPDATE_GROUP, this.cmdService.updateGroup));
    this.subs.push(vscode.commands.registerCommand(cmd.DELETE_GROUP, this.cmdService.deleteGroup));
    this.subs.push(vscode.commands.registerCommand(cmd.CREATE_PROJECT, this.cmdService.createProject));
    this.subs.push(vscode.commands.registerCommand(cmd.UPDATE_PROJECT, this.cmdService.updateProject));
    this.subs.push(vscode.commands.registerCommand(cmd.DELETE_PROJECT, this.cmdService.deleteProject));
  }
}
