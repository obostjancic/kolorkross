var assert = require("assert");
import { Project } from "../models/types";
import { MockRepository, Repository } from "../repositories/base.repository";
import { ProjectService } from "./project.service";

const mockProject = {
  id: "1",
  name: "project1",
  color: "#FF0000",
  path: "path1",
} as Project;

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
      assert.equal(projects[0].id, "1");
      assert.equal(projects[0].name, "project1");
      repository.delete("1");
    });
  });

  describe("findById", () => {
    it("should return project with id", async () => {
      await repository.create(mockProject);
      const project = await service.findById(mockProject.id);
      assert.equal(project.id, mockProject.id);
      assert.equal(project.name, mockProject.name);
      assert.equal(project.color, mockProject.color);
    });

    it("should throw an exception", async () => {
      const gettingNonexistingProject = async () => service.findById("2");
      assert.rejects(gettingNonexistingProject, Error, "Project not found");
    });
  });

  describe("create", () => {
    it("should create project", async () => {
      const project = await service.create(mockProject);
      assert.equal(project.id, mockProject.id);
      assert.equal(project.name, mockProject.name);
      assert.equal(project.color, mockProject.color);
    });

    it("should throw an exception", async () => {
      const creatingExistingProject = async () => service.create(mockProject);
      assert.rejects(creatingExistingProject, Error, "Project already exists");
    });
  });

  describe("update", () => {
    it("should update project", async () => {
      await repository.create(mockProject);
      const project = await service.update(mockProject);
      assert.equal(project.id, mockProject.id);
      assert.equal(project.name, mockProject.name);
      assert.equal(project.color, mockProject.color);
    });

    it("should throw an exception", async () => {
      const updatingNonexistingProject = async () => service.update(mockProject);
      assert.rejects(updatingNonexistingProject, Error, "Project not found");
    });
  });

  describe("delete", () => {
    it("should delete project", async () => {
      await repository.create(mockProject);
      await service.delete(mockProject);
      assert.equal(repository.findById(mockProject.id), undefined);
    });

    it("should throw an exception", async () => {
      const deletingNonexistingProject = async () => service.delete({ ...mockProject, id: "2" });
      assert.rejects(deletingNonexistingProject, Error, "Project not found");
    });
  });
});
