import "reflect-metadata";
import Container from "typedi";
import { GroupRepository } from "../repositories/group.repository";
import { MockRepository } from "../repositories/mock.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { CommandService } from "./command.service";

// jest.mock("vscode");

class Mock {}
describe("CommandService", () => {
  let service: CommandService;
  // let projectService: ProjectService;
  // let groupService: GroupService;
  // let windowService: WindowService;
  // let workspaceConfigService: WorkspaceConfigService;

  beforeEach(() => {
    Container.set(ProjectRepository, MockRepository);
    Container.set(GroupRepository, MockRepository);

    // projectService = Container.get(ProjectService);
    // groupService = Container.get(GroupService);
    // windowService = Container.get(WindowService);
    // workspaceConfigService = Container.get(WorkspaceConfigService);
    // service = Container.get(CommandService);
  });

  it("Should open project", async () => {
    // windowService.validatedInput = jest.fn();
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
