import Container, { Service } from "typedi";
import { Memento } from "vscode";
import { CreateGroupDTO, Group } from "../models/types";
import { token } from "../util/constants";
import { id, matcher, Repository } from "./base.repository";

@Service()
export class GroupRepository implements Repository<Group> {
  private readonly section = "dash.groups";
  private readonly config: Memento = Container.get(token.GLOBAL_STATE);

  private readGroupConfig(): Record<string, Group> {
    return this.config.get(this.section) || {};
  }

  private async writeGroupConfig(data: Record<string, Group>): Promise<void> {
    this.config.update(this.section, data);
  }

  public findById(id: string): Group | undefined {
    return this.readGroupConfig()[id];
  }

  public findAll(): Group[] {
    return Object.values(this.readGroupConfig());
  }

  public find(query: Partial<Group>): Group[] {
    return this.findAll().filter(g => matcher(g, query));
  }

  public async create(group: CreateGroupDTO): Promise<Group> {
    const newGroup = { ...group, id: id() } as Group;
    const currentConfig = this.readGroupConfig();
    await this.writeGroupConfig({ ...currentConfig, [newGroup.id]: newGroup });
    return newGroup;
  }

  public async update(id: string, updateData: Partial<Group>): Promise<Group> {
    const group = this.findById(id);
    if (!group) {
      throw new Error("Group not found");
    }

    const updatedGroup = { ...group, ...updateData };
    const currentConfig = this.readGroupConfig();
    await this.writeGroupConfig({ ...currentConfig, [group.id]: updatedGroup });

    return updatedGroup;
  }

  public async delete(id: string): Promise<void> {
    const { [id]: _, ...newConfig } = this.readGroupConfig();
    await this.writeGroupConfig(newConfig);
  }
}
