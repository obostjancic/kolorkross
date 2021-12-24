import { inject, singleton } from "tsyringe";
import { Memento } from "vscode";
import { Group } from "../models/types";
import { section, token } from "../util/constants";
import { BaseRepository } from "./base.repository";

@singleton()
export class GroupRepository extends BaseRepository<Group> {
  private readonly stateSection = section.GROUPS;

  constructor(@inject(token.GLOBAL_STATE) private readonly state: Memento) {
    super("Group");
  }

  read(): Record<string, Group> {
    return this.state.get(this.stateSection) || {};
  }

  async write(data: Record<string, Group>): Promise<void> {
    this.state.update(this.stateSection, data);
  }
}
