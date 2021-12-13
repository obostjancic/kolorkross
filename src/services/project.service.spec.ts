var assert = require("assert");
import { Color, Project } from "../models/types";
import { MockRepository, Repository } from "../repositories/base.repository";
import { ProjectService } from "./project.service";

const mockProject = {
  name: "project1",
  color: "#FF0000" as Color,
  path: "dir1/dir12/path1",
};

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: Repository<Project>;

  beforeEach(() => {
    repository = new MockRepository<Project>();
    service = new ProjectService(repository);
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const projects = await service.findAll();
      assert.equal(projects.length, 0);
    });

    it("should return one project", async () => {
      await repository.create(mockProject);
      const projects = await service.findAll();
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "project1");
      repository.delete(projects[0].id);
    });
  });

  describe("findById", () => {
    it("should return project with id", async () => {
      const created = await repository.create(mockProject);
      const project = await service.findById(created.id);
      assert.equal(created.id, project.id);
      assert.equal(created.name, project.name);
      assert.equal(created.color, project.color);
    });

    it("should throw an exception", async () => {
      const gettingNonexistingProject = async () => service.findById("2");
      assert.rejects(gettingNonexistingProject, Error, "Project not found");
    });
  });

  describe("create", () => {
    it("should create a project when all props are passed", async () => {
      const project = await service.create(mockProject);
      assert.equal(project.name, mockProject.name);
      assert.equal(project.color, mockProject.color);
    });
    it("should create a project when path and name are passed", async () => {
      const project = await service.create({ name: mockProject.name, path: mockProject.path });
      assert.equal(project.name, mockProject.name);
      assert.equal(project.path, mockProject.path);
      assert.notEqual(project.color, mockProject.color);
    });
    it("should create a project when path is passed", async () => {
      const project = await service.create({ path: mockProject.path });
      assert.equal(project.name, mockProject.path.split("/").pop());
      assert.equal(project.path, mockProject.path);
      assert.notEqual(project.color, mockProject.color);
    });

    it("should throw an exception", async () => {
      const creatingExistingProject = async () => service.create(mockProject);
      assert.rejects(creatingExistingProject, Error, "Project already exists");
    });
  });

  describe("update", () => {
    it("should update project", async () => {
      const created = await repository.create(mockProject);
      const project = await service.update({ id: created.id, name: "project2" });
      assert.equal(created.id, project.id);
      assert.equal("project2", project.name);
      assert.equal(created.color, project.color);
    });

    it("should throw an exception", async () => {
      const updatingNonexistingProject = async () => service.update({ id: "2", name: "project2" });
      assert.rejects(updatingNonexistingProject, Error, "Project not found");
    });
  });

  describe("delete", () => {
    it("should delete project", async () => {
      const created = await repository.create(mockProject);
      await service.delete(created);
      assert.equal(repository.findById(created.id), undefined);
    });

    it("should throw an exception", async () => {
      const deletingNonexistingProject = async () => service.delete({ ...mockProject, id: "2" });
      assert.rejects(deletingNonexistingProject, Error, "Project not found");
    });
  });
});
