import { WorkspaceConfiguration } from "vscode";
import { Group } from "../models/types";
import { matcher, Repository } from "./base.repository";

export class GroupRepository implements Repository<Group> {
  private readonly config: WorkspaceConfiguration;
  private readonly section = "dash.groups";

  constructor(config: WorkspaceConfiguration) {
    this.config = config;
  }

  private readGroupConfig(): Record<string, Group> {
    return this.config.get(this.section) || {};
  }

  private async writeGroupConfig(data: Record<string, Group>): Promise<void> {
    this.config.update(this.section, data, true);
  }

  findById(id: string): Group | undefined {
    return this.readGroupConfig()[id];
  }

  findAll(): Group[] {
    return Object(this.readGroupConfig()).values();
  }

  find(query: Partial<Group>): Group[] {
    return this.findAll().filter(g => matcher(g, query));
  }

  async create(group: Group): Promise<Group> {
    const currentConfig = this.readGroupConfig();
    await this.writeGroupConfig({ ...currentConfig, [group.id]: group });
    return group;
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
