import "reflect-metadata";
import Container from "typedi";
import { Color, Group, Project } from "../models/types";
import { MockRepository, Repository } from "../repositories/base.repository";
import { GroupRepository } from "../repositories/group.repository";
import { GroupService } from "./group.service";

const mockGroup = {
  name: "group1",
  projects: ["0"],
};

describe("GroupService", () => {
  let service: GroupService;
  let repository: Repository<Group> = new MockRepository<Group>();
  beforeEach(() => {
    Container.set(GroupRepository, repository);
    service = Container.get(GroupService);
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const groups = await service.findAll();
      expect(groups.length).toEqual(0);
    });

    it("should return one group", async () => {
      const group = await repository.create({ name: "group1" });

      const groups = await service.findAll();
      expect(groups.length).toEqual(1);
      expect(groups[0].id).toEqual(group.id);
      expect(groups[0].name).toEqual(group.name);

      repository.delete(group.id);
    });
  });

  describe("findById", () => {
    it("should return group with id", async () => {
      const created = await repository.create(mockGroup);
      const group = await service.findById(created.id);
      expect(group.id).toEqual(created.id);
      expect(group.name).toEqual(created.name);
    });

    it("should throw an exception", async () => {
      const gettingNonexistingGroup = async () => service.findById("2");
      expect(gettingNonexistingGroup).rejects.toThrow("Group not found");
    });
  });

  describe("create", () => {
    it("should create a group when all props are passed", async () => {
      const group = await service.create(mockGroup);
      expect(group.name).toEqual(mockGroup.name);
    });

    it("should create a group when name and color are passed", async () => {
      const group = await service.create({ name: mockGroup.name });
      expect(group.name).toEqual(mockGroup.name);
    });

    it("should create a group when only name is passed", async () => {
      const group = await service.create({ name: mockGroup.name });
      expect(group.name).toEqual(mockGroup.name);
    });

    // it("should throw an exception", async () => {
    //   const creatingExistingGroup = async () => service.create(mockGroup);
    //   expect(creatingExistingGroup).rejects.toThrow("Group already exists");
    // });
  });

  describe("update", () => {
    it("should update group", async () => {
      const group = await repository.create(mockGroup);
      const updated = await service.update({ id: group.id, name: "updatedName" });
      expect(group.id).toEqual(updated.id);
      expect("updatedName").toEqual(updated.name);
    });

    it("should throw an exception", async () => {
      const updatingNonexistingGroup = async () => service.update({ id: "2", name: "updatedName" });
      expect(updatingNonexistingGroup).rejects.toThrow("Group not found");
    });
  });

  describe("delete", () => {
    it("should delete group", async () => {
      const created = await repository.create(mockGroup);
      await service.delete(created.id);
      expect(repository.findById(created.id)).toEqual(undefined);
    });

    it("should throw an exception", async () => {
      const deletingNonexistingGroup = async () => service.delete("2");
      expect(deletingNonexistingGroup).rejects.toThrow("Group not found");
    });
  });

  describe("createProject", () => {
    it("should add project to group", async () => {
      const group = await repository.create(mockGroup);
      const project = {
        id: "1",
        name: "project1",
        color: { name: "red", value: "#FF0000" },
        path: "path1",
      };
      await service.createProject(project, group);
      const savedGroup = await service.findById(group.id);
      expect(savedGroup.projects.length).toEqual(2);
      expect(savedGroup.projects[1]).toEqual(project.id);
    });
  });

  describe("removeProject", () => {
    it("should remove project from group", async () => {
      const group = await repository.create(mockGroup);
      await service.removeProject({ id: "0" } as Project, group);
      const savedGroup = await service.findById(group.id);
      expect(savedGroup.projects.length).toEqual(0);
    });
  });
});
