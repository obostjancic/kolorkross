import Container, { Service } from "typedi";
import { Memento } from "vscode";
import { Group } from "../models/types";
import { token } from "../util/constants";
import { BaseRepository } from "./base.repository";

@Service()
export class GroupRepository extends BaseRepository<Group> {
  private readonly section = "dash.groups";
  private readonly config: Memento = Container.get(token.GLOBAL_STATE);

  constructor() {
    super("Group");
  }

  read(): Record<string, Group> {
    return this.config.get(this.section) || {};
  }

  async write(data: Record<string, Group>): Promise<void> {
    this.config.update(this.section, data);
  }
}
