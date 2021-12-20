import "reflect-metadata";
import Container from "typedi";
import { Group } from "../models/types";
import { section, token } from "../util/constants";
import { MockMemento } from "../util/test";
import { Repository } from "./base.repository";
import { GroupRepository } from "./group.repository";

const group = {
  id: "1",
  name: "group1",
};

describe("GroupRepository", () => {
  let state = new MockMemento();
  let repository: Repository<Group>;

  beforeEach(() => {
    Container.set(token.GLOBAL_STATE, state);
    repository = Container.get(GroupRepository);
  });

  it("should have properties", () => {
    const repo: any = new GroupRepository();
    expect(repo).toBeDefined();
    expect(repo["state"]).toBeDefined();
    expect(repo["read"]).toBeDefined();
    expect(repo["write"]).toBeDefined();
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const groups = await repository.findAll();
      expect(groups.length).toEqual(0);
    });

    it("should return one group", async () => {
      await state.update(section.GROUPS, { [group.id]: group });
      const groups = await repository.findAll();
      expect(groups.length).toEqual(1);
    });
  });

  describe("findById", () => {
    it("should return group with id", async () => {
      await state.update(section.GROUPS, { [group.id]: group });
      const found = await repository.findById(group.id);
      expect(found).toBeDefined();
      expect(found?.id).toEqual(group.id);
    });

    it("should return undefined for nonexsting group", async () => {
      const notFound = await repository.findById("2");
      expect(notFound).toBeUndefined();
    });
  });

  describe("find", () => {
    it("should match group by name", async () => {
      await state.update(section.GROUPS, { [group.id]: group, ["2"]: group });
      const found = await repository.find({ name: "group1" });
      expect(found.length).toEqual(2);
    });

    it("should return nothing", async () => {
      const found = await repository.find({ name: "group2" });
      expect(found.length).toEqual(0);
    });
  });

  describe("create", () => {
    it("should create a group", async () => {
      const created = await repository.create(group);
      expect(created).toBeDefined();
      expect(created.id).toEqual(state.get(section.GROUPS)[created.id].id);
      expect(created.name).toEqual(group.name);
    });
  });

  describe("update", () => {
    it("should update a group", async () => {
      await state.update(section.GROUPS, { [group.id]: group });
      const created = state.get(section.GROUPS)[group.id];
      const updated = await repository.update(created.id, {
        ...created,
        name: "group2",
      });
      expect(updated).toBeDefined();
      expect(updated?.id).toEqual(created.id);
      expect(updated?.name).toEqual("group2");
    });

    it("should throw an expception if group doesn't exist", async () => {
      await expect(repository.update("2", { ...group, projects: [] })).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete a project", async () => {
      await state.update(section.GROUPS, { [group.id]: group });
      const created = state.get(section.GROUPS)[group.id];
      await repository.delete(created.id);
      const deleted = state.get(section.GROUPS)[group.id];
      expect(deleted).toBeUndefined();
    });
  });
});
