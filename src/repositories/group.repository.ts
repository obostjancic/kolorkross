import { Memento, WorkspaceConfiguration } from "vscode";
import { CreateGroupDTO, Group } from "../models/types";
import { id, matcher, Repository } from "./base.repository";

export class GroupRepository implements Repository<Group> {
  private readonly config: Memento;
  private readonly section = "dash.groups";

  constructor(config: Memento) {
    this.config = config;
  }

  private readGroupConfig(): Record<string, Group> {
    return this.config.get(this.section) || {};
  }

  private async writeGroupConfig(data: Record<string, Group>): Promise<void> {
    this.config.update(this.section, data);
  }

  findById(id: string): Group | undefined {
    return this.readGroupConfig()[id];
  }

  findAll(): Group[] {
    return Object.values(this.readGroupConfig());
  }

  find(query: Partial<Group>): Group[] {
    return this.findAll().filter(g => matcher(g, query));
  }

  async create(group: CreateGroupDTO): Promise<Group> {
    const newGroup = { ...group, id: id() } as Group;
    const currentConfig = this.readGroupConfig();
    await this.writeGroupConfig({ ...currentConfig, [newGroup.id]: newGroup });
    return newGroup;
  }

  async update(id: string, updateData: Partial<Group>): Promise<Group> {
    const group = this.findById(id);
    if (!group) {
      throw new Error("Group not found");
    }

    const updatedGroup = { ...group, ...updateData };
    const currentConfig = this.readGroupConfig();
    await this.writeGroupConfig({ ...currentConfig, [group.id]: updatedGroup });

    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    const { [id]: _, ...newConfig } = this.readGroupConfig();
    await this.writeGroupConfig(newConfig);
  }
}
