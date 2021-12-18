import Container, { Service } from "typedi";
import { CommandService } from "./services/command.service";
import { VSCode } from "./util/vscode.env";
import { DashboardPanel } from "./ui/dasboard.panel";
import { cmd, token } from "./util/constants";

@Service()
export class CommandRegisterer {
  private readonly cmdService: CommandService = Container.get(CommandService);
  private readonly subs: any = Container.get(token.SUBSCRIPTIONS);

  public register() {
    this.subs.push(VSCode.registerCommand(cmd.OPEN_DASHBOARD, DashboardPanel.render));
    this.subs.push(VSCode.registerCommand(cmd.CREATE_GROUP, this.cmdService.createGroup));
    this.subs.push(VSCode.registerCommand(cmd.UPDATE_GROUP, this.cmdService.updateGroup));
    this.subs.push(VSCode.registerCommand(cmd.DELETE_GROUP, this.cmdService.deleteGroup));
    this.subs.push(VSCode.registerCommand(cmd.CREATE_PROJECT, this.cmdService.createProject));
    this.subs.push(VSCode.registerCommand(cmd.UPDATE_PROJECT, this.cmdService.updateProject));
    this.subs.push(VSCode.registerCommand(cmd.DELETE_PROJECT, this.cmdService.deleteProject));
  }
}