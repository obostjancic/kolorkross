import "reflect-metadata";
import { container } from "tsyringe";
import { Migration } from "../models/types";
import { section, token } from "../util/constants";
import { MockMemento } from "../util/test";
import { Repository } from "./base.repository";
import { MigrationRepository } from "./migration.repository";

const migration = {
  id: "1",
  name: "migration1",
};

describe("MigrationRepository", () => {
  const state = new MockMemento();
  let repository: Repository<Migration>;

  beforeEach(() => {
    container.register(token.GLOBAL_STATE, { useValue: state });
    repository = container.resolve(MigrationRepository);
  });

  it("should have properties", () => {
    const repo: any = container.resolve(MigrationRepository);
    expect(repo).toBeDefined();
    expect(repo["state"]).toBeDefined();
    expect(repo["read"]).toBeDefined();
    expect(repo["write"]).toBeDefined();
  });

  describe("findAll", () => {
    it("should return nothing", async () => {
      const migrations = await repository.findAll();
      expect(migrations.length).toEqual(0);
    });

    it("should return one migration", async () => {
      await state.update(section.MIGRATIONS, { [migration.id]: migration });
      const migrations = await repository.findAll();
      expect(migrations.length).toEqual(1);
    });
  });

  describe("findById", () => {
    it("should return migration with id", async () => {
      await state.update(section.MIGRATIONS, { [migration.id]: migration });
      const found = await repository.findById(migration.id);
      expect(found).toBeDefined();
      expect(found?.id).toEqual(migration.id);
    });

    it("should return undefined for nonexsting migration", async () => {
      const notFound = await repository.findById("2");
      expect(notFound).toBeUndefined();
    });
  });

  describe("find", () => {
    it("should match migration by name", async () => {
      await state.update(section.MIGRATIONS, { [migration.id]: migration, ["2"]: migration });
      const found = await repository.find({ name: "migration1" });
      expect(found.length).toEqual(2);
    });

    it("should return nothing", async () => {
      const found = await repository.find({ name: "migration2" });
      expect(found.length).toEqual(0);
    });
  });

  describe("findOne", () => {
    it("should match migration by name", async () => {
      await state.update(section.MIGRATIONS, { [migration.id]: migration, ["2"]: migration });
      const found = await repository.findOne({ name: "migration1" });
      expect(found).toBeDefined();
      expect(found?.id).toEqual(migration.id);
    });

    it("should return nothing", async () => {
      const found = await repository.findOne({ name: "no migration" });
      expect(found).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a migration", async () => {
      const created = await repository.create(migration);
      expect(created).toBeDefined();
      expect(created.id).toEqual(state.get(section.MIGRATIONS)[created.id].id);
      expect(created.name).toEqual(migration.name);
    });
  });

  describe("update", () => {
    it("should update a migration", async () => {
      await state.update(section.MIGRATIONS, { [migration.id]: migration });
      const created = state.get(section.MIGRATIONS)[migration.id];
      const updated = await repository.update(created.id, {
        ...created,
        name: "migration2",
      });
      expect(updated).toBeDefined();
      expect(updated?.id).toEqual(created.id);
      expect(updated?.name).toEqual("migration2");
    });

    it("should throw an expception if migration doesn't exist", async () => {
      await expect(repository.update("2", { ...migration })).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete a project", async () => {
      await state.update(section.MIGRATIONS, { [migration.id]: migration });
      const created = state.get(section.MIGRATIONS)[migration.id];
      await repository.delete(created.id);
      const deleted = state.get(section.MIGRATIONS)[migration.id];
      expect(deleted).toBeUndefined();
    });
  });
});
