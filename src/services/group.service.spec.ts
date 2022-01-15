import "reflect-metadata";
import { container } from "tsyringe";
import { Group, Project } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { GroupRepository } from "../repositories/group.repository";
import { Direction } from "../util/constants";
import { MockRepository } from "../util/test";
import { GroupService } from "./group.service";

const mockGroup = {
  name: "group1",
  projects: ["0"],
};

describe("GroupService", () => {
  let service: GroupService;
  const repository: Repository<Group> = new MockRepository<Group>();

  beforeEach(() => {
    container.register(GroupRepository, { useValue: repository });
    service = container.resolve(GroupService);
  });

  afterEach(async () => {
    const groups = repository.findAll();
    const ids = groups.map(group => group.id);
    for (const groupId of ids) {
      await repository.delete(groupId);
    }
    if (repository.findAll().length > 0) {
      throw new Error("GroupService: afterEach: groups not deleted");
    }
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

    it("should return two groups", async () => {
      const group1 = await repository.create({ name: "group1", order: 1 });
      const group2 = await repository.create({ name: "group2", order: 0 });

      const groups = await service.findAll();
      expect(groups.length).toEqual(2);
      expect(groups[0].name).toEqual(group2.name);
      expect(groups[1].name).toEqual(group1.name);
    });
  });

  describe("countAll", () => {
    it("shoulrd return zero because there are no groups", async () => {
      const count = await service.countAll();
      expect(count).toEqual(0);
    });

    it("should return one group", async () => {
      await repository.create({ name: "group1" });

      const count = await service.countAll();
      expect(count).toEqual(1);
    });

    it("should return two groups", async () => {
      await repository.create({ name: "group1" });
      await repository.create({ name: "group2" });

      const count = await service.countAll();
      expect(count).toEqual(2);
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
      expect(group.order).toEqual(0);
    });

    it("should create a group when name and color are passed", async () => {
      const group = await service.create({ name: mockGroup.name });
      expect(group.name).toEqual(mockGroup.name);
      expect(group.order).toEqual(0);
    });

    it("should create a group when only name is passed", async () => {
      const group = await service.create({ name: mockGroup.name });
      expect(group.name).toEqual(mockGroup.name);
      expect(group.order).toEqual(0);
    });

    it("should two groups when called twice", async () => {
      const group1 = await service.create({ name: mockGroup.name });
      const group2 = await service.create({ name: mockGroup.name });
      expect(group1.name).toEqual(mockGroup.name);
      expect(group1.order).toEqual(0);
      expect(group2.name).toEqual(mockGroup.name);
      expect(group2.order).toEqual(1);
    });
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

  describe("updateOrder", () => {
    it("should push group up", async () => {
      const { id: group1Id } = await service.create({ name: mockGroup.name });
      const { id: group2Id } = await service.create({ name: mockGroup.name });

      await service.updateOrder(group2Id, Direction.up);

      const group1 = await service.findById(group1Id);
      const group2 = await service.findById(group2Id);

      expect(group2.order).toEqual(0);
      expect(group1.order).toEqual(1);
    });

    it("should push group down", async () => {
      const { id: group1Id } = await service.create({ name: mockGroup.name });
      const { id: group2Id } = await service.create({ name: mockGroup.name });

      await service.updateOrder(group1Id, Direction.down);

      const group1 = await service.findById(group1Id);
      const group2 = await service.findById(group2Id);

      expect(group2.order).toEqual(0);
      expect(group1.order).toEqual(1);
    });

    it("should throw an exception when called with non existant group", async () => {
      const pushingNonexistingGroup = async () => service.updateOrder("2", Direction.up);
      expect(pushingNonexistingGroup).rejects.toThrow("Group not found");
    });

    it("should throw an exception when there is no group to swap with", async () => {
      const group1 = await service.create({ name: mockGroup.name });
      const group2 = await service.create({ name: mockGroup.name });

      await repository.update(group2.id, { ...group2, order: 9999 });
      const pushingFirstElementDown = async () => service.updateOrder(group1.id, Direction.down);

      expect(pushingFirstElementDown).rejects.toThrow("Group to swap with not found");
    });

    it("should throw an exception when trying to push the first element up", async () => {
      const group = await service.create({ name: mockGroup.name });
      const pushingFirstElementUp = async () => service.updateOrder(group.id, Direction.up);
      expect(pushingFirstElementUp).rejects.toThrow("Cannot move group up");
    });

    it("should throw an exception when trying to push the last element down", async () => {
      const group = await service.create({ name: mockGroup.name });
      const pushingLastElementDown = async () => service.updateOrder(group.id, Direction.down);
      expect(pushingLastElementDown).rejects.toThrow("Cannot move group down");
    });
  });

  describe("updateProjectOrder", () => {
    const createGroupWithProjects = async () => {
      const group = await service.create({ name: mockGroup.name });
      await service.addProject(group, { id: "pr1" } as Project);
      await service.addProject(group, { id: "pr2" } as Project);

      return service.findById(group.id);
    };

    it("should push project up", async () => {
      const group = await createGroupWithProjects();
      await service.updateProjectOrder(group.id, "pr2", Direction.up);

      const groupAfterUpdate = await service.findById(group.id);

      expect(groupAfterUpdate.projects[0]).toEqual("pr2");
    });

    it("should push project down", async () => {
      const group = await createGroupWithProjects();
      await service.updateProjectOrder(group.id, "pr1", Direction.down);

      const groupAfterUpdate = await service.findById(group.id);

      expect(groupAfterUpdate.projects[0]).toEqual("pr2");
    });

    it("should throw an exception when trying to push a project that is not a part of the group", async () => {
      const group = await createGroupWithProjects();

      const pushingNonExistingProject = async () => service.updateProjectOrder(group.id, "pr3", Direction.up);
      expect(pushingNonExistingProject).rejects.toThrow("Project not found in group");
    });

    it("should throw an exception when trying to push the first element up", async () => {
      const group = await createGroupWithProjects();

      const pushingFirstElementUp = async () => service.updateProjectOrder(group.id, "pr1", Direction.up);
      expect(pushingFirstElementUp).rejects.toThrow("Cannot move project up");
    });

    it("should throw an exception when trying to push the last element down", async () => {
      const group = await createGroupWithProjects();

      const pushingLastElementDown = async () => service.updateProjectOrder(group.id, "pr2", Direction.down);
      expect(pushingLastElementDown).rejects.toThrow("Cannot move project down");
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
    const project = {
      id: "1",
      name: "project1",
      color: { name: "red", value: "#FF0000" },
      path: "path1",
    };

    it("should add project to group", async () => {
      const group = await repository.create(mockGroup);
      await service.addProject(group, project);
      const savedGroup = await service.findById(group.id);
      expect(savedGroup.projects.length).toEqual(2);
      expect(savedGroup.projects[1]).toEqual(project.id);
    });

    it("should throw an exception when adding the same project twice", async () => {
      const group = await repository.create(mockGroup);
      await service.addProject(group, project);
      const savedGroup = await service.findById(group.id);
      const creatingSameProjectTwice = service.addProject(savedGroup, project);

      expect(creatingSameProjectTwice).rejects.toThrow("Project already exists in group");
    });
  });

  describe("removeProject", () => {
    it("should remove project from group", async () => {
      const group = await repository.create(mockGroup);
      await service.removeProject({ id: "0" } as Project, group);
      const savedGroup = await service.findById(group.id);
      expect(savedGroup.projects.length).toEqual(0);
    });

    it("should throw an exception when removing a project that does not exist", async () => {
      const group = await repository.create(mockGroup);
      const removingNonexistingProject = async () => service.removeProject({ id: "2" } as Project, group);
      expect(removingNonexistingProject).rejects.toThrow("Project does not exist in group");
    });
  });
});
