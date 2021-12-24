import "reflect-metadata";
import { container } from "tsyringe";
import { Group, Project } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { GroupRepository } from "../repositories/group.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { MockRepository } from "../util/test";
import { CommandService } from "./command.service";
import { GroupService } from "./group.service";
import { ProjectService } from "./project.service";
import { WindowService } from "./window.service";
import { WorkspaceConfigService } from "./workspaceConfig.service";
// import { WindowService } from "./window.service";

// jest.mock("VSCode", () => {});

describe("CommandService", () => {
  let service: CommandService;
  let projectService: ProjectService;
  let groupService: GroupService;
  // let windowService: WindowService;
  let workspaceConfigService: WorkspaceConfigService;

  beforeEach(() => {
    container.register<Repository<Project>>(ProjectRepository, { useValue: new MockRepository<Project>() });
    container.register<Repository<Group>>(GroupRepository, { useValue: new MockRepository<Group>() });
    projectService = container.resolve(ProjectService);
    groupService = container.resolve(GroupService);
    // windowService = container.resolve(WindowService);
    // workspaceConfigService = container.resolve(WorkspaceConfigService);
    // service = container.resolve(CommandService);
  });

  it("Should open project", async () => {
    // windowService.defaultInput = jest.fn();
    // await service.openProject();
    // expect(VSCode.executeCommand).toHaveBeenCalledWith("vscode.openFolder", VSCode.file(""), true);
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
