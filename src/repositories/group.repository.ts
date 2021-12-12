import { WorkspaceConfiguration } from "vscode";
import { Group } from "../models/types";
import { matcher, Repository } from "./base.repository";

export class GroupRepository implements Repository<Group> {
  private readonly config: WorkspaceConfiguration;
  private readonly section = "dash.groups";

  constructor(config: WorkspaceConfiguration) {
    this.config = config;
  }

  private readGroupConfig(): Group[] {
    return this.config.get(this.section) || [];
  }

  private async writeGroupConfig(data: any) {
    this.config.update(this.section, data, true);
  }

  findById(id: string): Group | undefined {
    return this.readGroupConfig().find((g: Group) => g.id === id);
  }

  findAll(): Group[] {
    return this.readGroupConfig();
  }

  find(query: Partial<Group>): Group[] {
    return this.readGroupConfig().filter(g => matcher(g, query));
  }

  async create(group: Group): Promise<Group> {
    await this.writeGroupConfig([...this.readGroupConfig(), group]);
    return group;
  }

  async update(id: string, updateData: Partial<Group>): Promise<Group> {
    const group = this.findById(id);
    if (!group) {
      throw new Error("Group not found");
    }

    const updatedGroup = { ...group, ...updateData };
    const otherGroups = this.readGroupConfig().filter(g => g.id !== id);
    await this.writeGroupConfig([...otherGroups, updatedGroup]);

    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    const otherGroups = this.readGroupConfig().filter(g => g.id !== id);
    await this.writeGroupConfig(otherGroups);
  }
}
