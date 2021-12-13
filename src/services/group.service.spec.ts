var assert = require("assert");
import { Color, Group, Project } from "../models/types";
import { MockRepository, Repository } from "../repositories/base.repository";
import { GroupService } from "./group.service";

const mockGroup = {
  name: "group1",
  color: "#FF0000" as Color,
  projects: ["0"],
};

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
      const group = await repository.create({ name: "group1" });

      const groups = await service.findAll();
      assert.equal(groups.length, 1);
      assert.equal(groups[0].id, group.id);
      assert.equal(groups[0].name, group.name);

      repository.delete(group.id);
    });
  });

  describe("findById", () => {
    it("should return group with id", async () => {
      const created = await repository.create(mockGroup);
      const group = await service.findById(created.id);
      assert.equal(group.id, created.id);
      assert.equal(group.name, created.name);
      assert.equal(group.color, created.color);
    });

    it("should throw an exception", async () => {
      const gettingNonexistingGroup = async () => service.findById("2");
      assert.rejects(gettingNonexistingGroup, Error, "Group not found");
    });
  });

  describe("create", () => {
    it("should create a group when all props are passed", async () => {
      const group = await service.create(mockGroup);
      assert.equal(group.name, mockGroup.name);
      assert.equal(group.color, mockGroup.color);
    });

    it("should create a group when name and color are passed", async () => {
      const group = await service.create({ name: mockGroup.name, color: mockGroup.color });
      assert.equal(group.name, mockGroup.name);
      assert.equal(group.color, mockGroup.color);
    });

    it("should create a group when only name is passed", async () => {
      const group = await service.create({ name: mockGroup.name });
      assert.equal(group.name, mockGroup.name);
      assert.notEqual(group.color, mockGroup.color);
    });

    it("should throw an exception", async () => {
      const creatingExistingGroup = async () => service.create(mockGroup);
      assert.rejects(creatingExistingGroup, Error, "Group already exists");
    });
  });

  describe("update", () => {
    it("should update group", async () => {
      const group = await repository.create(mockGroup);
      const updated = await service.update({ id: group.id, name: "updatedName" });
      assert.equal(group.id, updated.id);
      assert.equal("updatedName", updated.name);
      assert.equal(group.color, updated.color);
    });

    it("should throw an exception", async () => {
      const updatingNonexistingGroup = async () => service.update({ id: "2", name: "updatedName" });
      assert.rejects(updatingNonexistingGroup, Error, "Group not found");
    });
  });

  describe("delete", () => {
    it("should delete group", async () => {
      const created = await repository.create(mockGroup);
      await service.delete(created);
      assert.equal(repository.findById(created.id), undefined);
    });

    it("should throw an exception", async () => {
      const deletingNonexistingGroup = async () => service.delete({ ...mockGroup, id: "2" });
      assert.rejects(deletingNonexistingGroup, Error, "Group not found");
    });
  });

  describe("createProject", () => {
    it("should add project to group", async () => {
      const group = await repository.create(mockGroup);
      const project = {
        id: "1",
        name: "project1",
        color: "#FF0000" as Color,
        path: "path1",
      };
      await service.createProject(project, group);
      const savedGroup = await service.findById(group.id);
      assert.equal(savedGroup.projects.length, 2);
      assert.equal(savedGroup.projects[1], project.id);
    });
  });

  describe("removeProject", () => {
    it("should remove project from group", async () => {
      const group = await repository.create(mockGroup);
      await service.removeProject({ id: "0" } as Project, group);
      const savedGroup = await service.findById(group.id);
      assert.equal(savedGroup.projects.length, 0);
    });
  });
});
