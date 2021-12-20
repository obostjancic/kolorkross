import Container, { Service } from "typedi";
import { Memento } from "vscode";
import { Group } from "../models/types";
import { section, token } from "../util/constants";
import { BaseRepository } from "./base.repository";

@Service()
export class GroupRepository extends BaseRepository<Group> {
  private readonly stateSection = section.GROUPS;
  private readonly state: Memento = Container.get(token.GLOBAL_STATE);

  constructor() {
    super("Group");
  }

  read(): Record<string, Group> {
    return this.state.get(this.stateSection) || {};
  }

  async write(data: Record<string, Group>): Promise<void> {
    this.state.update(this.stateSection, data);
  }
}
