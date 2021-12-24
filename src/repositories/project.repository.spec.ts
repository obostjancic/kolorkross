import "reflect-metadata";
import { container } from "tsyringe";
import { Project } from "../models/types";
import { section, token } from "../util/constants";
import { MockMemento } from "../util/test";
import { Repository } from "./base.repository";
import { ProjectRepository } from "./project.repository";

const project = {
  id: "1",
  name: "project1",
  color: { name: "red", value: "#FF0000" },
  path: "dir1/dir12/path1",
};

describe("ProjectRepository", () => {
  let state = new MockMemento();
  let repository: Repository<Project>;

  beforeEach(() => {
    container.register(token.GLOBAL_STATE, { useValue: state });
    repository = container.resolve(ProjectRepository);
  });

  it("should have properties", () => {
    const repo: any = container.resolve(ProjectRepository);
    expect(repo).toBeDefined();
    expect(repo["state"]).toBeDefined();
    expect(repo["read"]).toBeDefined();
    expect(repo["write"]).toBeDefined();
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const projects = await repository.findAll();
      expect(projects.length).toEqual(0);
    });

    it("should return one project", async () => {
      await state.update(section.PROJECTS, { [project.id]: project });
      const projects = await repository.findAll();
      expect(projects.length).toEqual(1);
    });
  });

  describe("findById", () => {
    it("should return project with id", async () => {
      await state.update(section.PROJECTS, { [project.id]: project });
      const found = await repository.findById(project.id);
      expect(found).toBeDefined();
      expect(found?.id).toEqual(project.id);
    });

    it("should return undefined for nonexsting project", async () => {
      const notFound = await repository.findById("2");
      expect(notFound).toBeUndefined();
    });
  });

  describe("find", () => {
    it("should match project by name", async () => {
      await state.update(section.PROJECTS, { [project.id]: project, ["2"]: project });
      const found = await repository.find({ name: "project1" });
      expect(found.length).toEqual(2);
    });

    it("should return nothing", async () => {
      const found = await repository.find({ name: "project2" });
      expect(found.length).toEqual(0);
    });
  });

  describe("create", () => {
    it("should create a project", async () => {
      const created = await repository.create(project);
      expect(created).toBeDefined();
      expect(created.id).toEqual(state.get(section.PROJECTS)[created.id].id);
      expect(created.name).toEqual(project.name);
      expect(created.color).toEqual(project.color);
      expect(created.path).toEqual(project.path);
    });
  });

  describe("update", () => {
    it("should update a project", async () => {
      await state.update(section.PROJECTS, { [project.id]: project });
      const created = state.get(section.PROJECTS)[project.id];
      const updated = await repository.update(created.id, {
        ...created,
        name: "project2",
      });
      expect(updated).toBeDefined();
      expect(updated?.id).toEqual(created.id);
      expect(updated?.name).toEqual("project2");
      expect(updated?.color).toEqual(created.color);
      expect(updated?.path).toEqual(created.path);
    });

    it("should throw an expception if project doesn't exist", async () => {
      await expect(repository.update("2", { ...project })).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete a project", async () => {
      await state.update(section.PROJECTS, { [project.id]: project });
      const created = state.get(section.PROJECTS)[project.id];
      await repository.delete(created.id);
      const deleted = state.get(section.PROJECTS)[project.id];
      expect(deleted).toBeUndefined();
    });
  });
});
