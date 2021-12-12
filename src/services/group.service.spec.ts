var assert = require("assert");
import { Color, Group, Project } from "../models/types";
import { MockRepository, Repository } from "../repositories/base.repository";
import { GroupService } from "./group.service";

const mockGroup = {
  id: "1",
  name: "group1",
  color: "#FF0000",
  projects: ["0"],
} as Group;

describe("GroupService", () => {
  let service: GroupService;
  let repository: Repository<Group>;
  beforeEach(() => {
    repository = new MockRepository<Group>();
    service = new GroupService(repository);
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const groups = await service.findAll();
      assert.equal(groups.length, 0);
    });

    it("should return one group", async () => {
      const group = {
        id: "1",
        name: "group1",
        color: "#FF0000" as Color,
        projects: [],
      };
      await repository.create(group);

      const groups = await service.findAll();
      assert.equal(groups.length, 1);
      assert.equal(groups[0].id, "1");
      assert.equal(groups[0].name, "group1");

      repository.delete("1");
    });
  });

  describe("findById", () => {
    it("should return group with id", async () => {
      await repository.create(mockGroup);
      const group = await service.findById(mockGroup.id);
      assert.equal(group.id, mockGroup.id);
      assert.equal(group.name, mockGroup.name);
      assert.equal(group.color, mockGroup.color);
    });

    it("should throw an exception", async () => {
      const gettingNonexistingGroup = async () => service.findById("2");
      assert.rejects(gettingNonexistingGroup, Error, "Group not found");
    });
  });

  describe("create", () => {
    it("should create group", async () => {
      const group = await service.create(mockGroup);
      assert.equal(group.id, mockGroup.id);
      assert.equal(group.name, mockGroup.name);
      assert.equal(group.color, mockGroup.color);
    });

    it("should throw an exception", async () => {
      const creatingExistingGroup = async () => service.create(mockGroup);
      assert.rejects(creatingExistingGroup, Error, "Group already exists");
    });
  });

  describe("update", () => {
    it("should update group", async () => {
      await repository.create(mockGroup);
      const group = await service.update(mockGroup);
      assert.equal(group.id, mockGroup.id);
      assert.equal(group.name, mockGroup.name);
      assert.equal(group.color, mockGroup.color);
    });

    it("should throw an exception", async () => {
      const updatingNonexistingGroup = async () => service.update(mockGroup);
      assert.rejects(updatingNonexistingGroup, Error, "Group not found");
    });
  });

  describe("delete", () => {
    it("should delete group", async () => {
      await repository.create(mockGroup);
      await service.delete(mockGroup);
      assert.equal(repository.findById(mockGroup.id), undefined);
    });

    it("should throw an exception", async () => {
      const deletingNonexistingGroup = async () => service.delete({ ...mockGroup, id: "2" });
      assert.rejects(deletingNonexistingGroup, Error, "Group not found");
    });
  });

  describe("addProject", () => {
    it("should add project to group", async () => {
      await repository.create(mockGroup);
      const project = {
        id: "1",
        name: "project1",
        color: "#FF0000" as Color,
        path: "path1",
      };
      await service.addProject(project, mockGroup);
      const group = await service.findById(mockGroup.id);
      assert.equal(group.projects.length, 2);
      assert.equal(group.projects[1], project.id);
    });
  });

  describe("removeProject", () => {
    it("should remove project from group", async () => {
      await repository.create(mockGroup);
      await service.removeProject({ id: "0" } as Project, mockGroup);
      const group = await service.findById(mockGroup.id);
      assert.equal(group.projects.length, 0);
    });
  });
});
