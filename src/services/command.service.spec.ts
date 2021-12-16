import "reflect-metadata";
import * as vscode from "vscode";
import Container from "typedi";
import { CommandService } from "./command.service";
import { GroupService } from "./group.service";
import { ProjectService } from "./project.service";
import { WindowService } from "./window.service";
import { WorkspaceConfigService } from "./workspaceConfig.service";

jest.mock("vscode");

class Mock {}
describe("CommandService", () => {
  let service: CommandService;
  let projectService = new Mock();
  let groupService = new Mock();
  let workspaceConfigService = new Mock();
  let windowService = new Mock();

  beforeEach(() => {
    Container.set(ProjectService, projectService);
    Container.set(GroupService, groupService);
    Container.set(WorkspaceConfigService, workspaceConfigService);
    Container.set(WindowService, windowService);
    service = Container.get(CommandService);
  });

  vscode.commands.executeCommand = jest.fn();

  it("should pass", () => {
    service.createGroup();
  });
  // describe("getRandomColor", () => {
  //   it("should return a color", () => {
  //     let color = colorService.getRandomColor();
  //     assert.equal(typeof color, "string");
  //   });
  // });
  // describe("getPallete", () => {
  //   it("should return a pallete", () => {
  //     const color = "#ff0000";
  //     let pallete = colorService.getPallete(color);
  //     assert.equal(pallete.foreground, `${color}FF`);
  //     assert.equal(pallete.background, `${color}28`);
  //   });
  // });
});
