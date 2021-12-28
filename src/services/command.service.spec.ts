import "reflect-metadata";

import * as handlers from "../util/error.handler";
const errorHandler = jest.spyOn(handlers, "handler").mockImplementation((error: Error) => {
  return error.message;
});

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

jest.mock("../util/vscode.env", () => ({ showErrorMessage: jest.fn(), executeCommand: jest.fn() }));

const mockProject = {
  name: "test-project",
  color: { name: "Red", value: "#ff0000" },
  path: "test-project",
};

const mockGroup = { name: "test-group" };

describe("CommandService", () => {
  let service: CommandService;
  let windowService: WindowService;
  let projectService: ProjectService;
  let groupService: GroupService;

  beforeEach(() => {
    jest.clearAllMocks();
    container.reset();
    container.register<Repository<Project>>(ProjectRepository, { useValue: new MockRepository<Project>() });
    container.register<Repository<Group>>(GroupRepository, { useValue: new MockRepository<Group>() });
    container.register<any>(WorkspaceConfigService, { useValue: { applyConfigToWorkspace: jest.fn() } });

    container.register<any>(WindowService, {
      useValue: {
        showErrorMessage: jest.fn(),
        defaultInput: jest.fn((label: string, id: string) => {
          if (id) {
            return Promise.resolve(id);
          }
          throw new Error(`No ${label} provided`);
        }),
        openProject: jest.fn(),
        inputPath: jest.fn(),
        input: jest.fn(),
        inputColor: jest.fn(),
        confirm: jest.fn(),
      },
    });
    windowService = container.resolve(WindowService);
    service = container.resolve(CommandService);
    groupService = container.resolve(GroupService);
    projectService = container.resolve(ProjectService);
  });

  afterEach(() => {
    groupService.deleteAll();
    projectService.deleteAll();
  });

  describe("openProject", () => {
    it("Should open existing project", async () => {
      const project = await projectService.create(mockProject);

      await service.openProject(project.id);

      expect(windowService.defaultInput).toHaveBeenCalledWith("Project Id", project.id);
      expect(windowService.openProject).toHaveBeenCalledWith(project);
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it("Should show error if project does not exist", async () => {
      await service.openProject("non-existent");

      expect(errorHandler).toReturnWith("Project not found");
    });
  });

  describe("createProject", () => {
    it("Should create project", async () => {
      const group = await groupService.create(mockGroup);
      jest.spyOn(windowService, "inputPath").mockImplementation(() => Promise.resolve("some path"));

      await service.createProject(group.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(windowService.defaultInput).toHaveBeenCalledWith("Group Id", group.id);
      expect(windowService.inputPath).toHaveBeenCalledWith("Open");

      expect(await projectService.findAll()).toHaveLength(1);
    });

    it("Should show error if no group id was provided", async () => {
      await service.createProject();

      expect(errorHandler).toReturnWith("No Group Id provided");
      expect(await projectService.findAll()).toHaveLength(0);
    });
  });

  describe("updateProject", () => {
    it("Should update project", async () => {
      const project = await projectService.create(mockProject);
      jest.spyOn(windowService, "inputPath").mockImplementation(() => Promise.resolve("test-project-updated"));

      await service.updateProject(project.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(windowService.defaultInput).toHaveBeenCalledWith("Project Id", project.id);

      expect((await projectService.findById(project.id)).path).toStrictEqual("test-project-updated");
    });

    it("Should show error if project does not exist", async () => {
      await service.updateProject("non-existent");

      expect(errorHandler).toReturnWith("Project not found");
    });
  });

  describe("deleteProject", () => {
    it("Should delete a project", async () => {
      const project = await projectService.create(mockProject);
      jest.spyOn(windowService, "confirm").mockImplementation(() => Promise.resolve(true));

      await service.deleteProject(project.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(windowService.defaultInput).toHaveBeenCalledWith("Project Id", project.id);
      expect(windowService.confirm).toHaveBeenCalledWith(`Are you sure you want to delete project ${project.name}?`);
      expect(await projectService.findAll()).toHaveLength(0);
    });

    it("Should show error if project does not exist", async () => {
      await service.deleteProject("non-existent");

      expect(errorHandler).toReturnWith("Project not found");
    });

    it("Should abort project deletion if confirm is not true", async () => {
      const project = await projectService.create(mockProject);
      jest.spyOn(windowService, "confirm").mockImplementation(() => Promise.resolve(false));

      await service.deleteProject(project.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(projectService.findById(project.id)).toBeDefined();
    });
  });

  describe("createGroup", () => {
    it("Should create a group", async () => {
      jest.spyOn(windowService, "defaultInput").mockImplementation(() => Promise.resolve("test-group"));
      await service.createGroup();

      expect(await groupService.findAll()).toHaveLength(1);
    });
  });

  describe("updateGroup", () => {
    it("Should update a group", async () => {
      const group = await container.resolve(GroupRepository).create(mockGroup);

      await service.updateGroup(group.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(windowService.defaultInput).toHaveBeenCalledWith("Group Id", group.id);
    });

    it("Should show error if group does not exist", async () => {
      await service.updateGroup("non-existent");
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe("deleteGroup", () => {
    it("Should delete a group", async () => {
      const group = await groupService.create(mockGroup);
      jest.spyOn(windowService, "confirm").mockImplementation(() => Promise.resolve(true));

      await service.deleteGroup(group.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(windowService.defaultInput).toHaveBeenCalledWith("Group Id", group.id);
      expect(windowService.confirm).toHaveBeenCalledWith(`Are you sure you want to delete group ${group.name}?`);
      expect(await groupService.findAll()).toHaveLength(0);
    });

    it("Should delete the group and all of its projects", async () => {
      const group = await groupService.create(mockGroup);
      const project = await projectService.create(mockProject);
      jest.spyOn(windowService, "confirm").mockImplementation(() => Promise.resolve(true));
      await groupService.addProject(group, project);

      await service.deleteGroup(group.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(await groupService.findAll()).toHaveLength(0);
      expect(await projectService.findAll()).toHaveLength(0);
    });

    it("Should abort group deletion if confirm is not true", async () => {
      const group = await groupService.create(mockGroup);
      jest.spyOn(windowService, "confirm").mockImplementation(() => Promise.resolve(false));

      await service.deleteGroup(group.id);

      expect(errorHandler).not.toHaveBeenCalled();
      expect(groupService.findById(group.id)).toBeDefined();
    });

    it("Should show error if group does not exist", async () => {
      await service.deleteGroup("non-existent");

      expect(errorHandler).toReturnWith("Group not found");
    });
  });
});
