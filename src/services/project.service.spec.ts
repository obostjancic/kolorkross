import "reflect-metadata";
import Container from "typedi";
import { Project } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { MockRepository } from "../util/test";
import { ProjectService } from "./project.service";

const mockProject = {
  name: "project1",
  color: { name: "red", value: "#FF0000" },
  path: "dir1/dir12/path1",
};

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: Repository<Project> = new MockRepository<Project>();

  beforeEach(() => {
    Container.set(ProjectRepository, repository);
    service = Container.get(ProjectService);
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const projects = await service.findAll();
      expect(projects.length).toEqual(0);
    });

    it("should return one project", async () => {
      await repository.create(mockProject);
      const projects = await service.findAll();
      expect(projects.length).toEqual(1);
      expect(projects[0].name).toEqual("project1");
    });
  });

  describe("findById", () => {
    it("should return project with id", async () => {
      const created = await repository.create(mockProject);
      const project = await service.findById(created.id);
      expect(created.id).toEqual(project.id);
      expect(created.name).toEqual(project.name);
      expect(created.color).toEqual(project.color);
    });

    it("should throw an exception", async () => {
      const gettingNonexistingProject = async () => service.findById("2");
      expect(gettingNonexistingProject).rejects.toThrow("Project not found");
      // , Error, "Project not found");
    });
  });

  describe("findByPath", () => {
    it("should return project with path", async () => {
      const created = await repository.create({
        ...mockProject,
        path: "dir/path",
      });
      const project = await service.findByPath(created.path);
      expect(created.id).toEqual(project.id);
    });

    it("should throw an exception when ", async () => {
      const gettingNonexistingProject = async () => service.findByPath("non/existing/path");
      expect(gettingNonexistingProject).rejects.toThrow("Project not found");
    });
  });

  describe("create", () => {
    it("should create a project when all props are passed", async () => {
      const project = await service.create(mockProject);
      expect(project.name).toEqual(mockProject.name);
      expect(project.color).toEqual(mockProject.color);
    });

    it("should create a project when path and name are passed", async () => {
      const project = await service.create({ name: mockProject.name, path: mockProject.path });
      expect(project.name).toEqual(mockProject.name);
      expect(project.path).toEqual(mockProject.path);
      expect(project.color).not.toEqual(mockProject.color);
    });

    it("should create a project when path is passed", async () => {
      const project = await service.create({ path: mockProject.path });
      expect(project.name).toEqual(mockProject.path.split("/").pop());
      expect(project.path).toEqual(mockProject.path);
      expect(project.color).not.toEqual(mockProject.color);
    });
  });

  describe("update", () => {
    it("should update project", async () => {
      const created = await repository.create(mockProject);
      const project = await service.update({ id: created.id, name: "project2" });
      expect(created.id).toEqual(project.id);
      expect("project2").toEqual(project.name);
      expect(created.color).toEqual(project.color);
    });

    it("should throw an exception", async () => {
      const updatingNonexistingProject = async () => service.update({ id: "2", name: "project2" });
      expect(updatingNonexistingProject).rejects.toThrow("Project not found");
    });
  });

  describe("delete", () => {
    it("should delete project", async () => {
      const created = await repository.create(mockProject);
      await service.delete(created.id);
      expect(repository.findById(created.id)).toEqual(undefined);
    });

    it("should throw an exception", async () => {
      const deletingNonexistingProject = async () => service.delete("2");
      expect(deletingNonexistingProject).rejects.toThrow("Project not found");
    });
  });
});
