import { inject, singleton } from "tsyringe";
import { Memento } from "vscode";
import { Group, Migration } from "../models/types";
import { section, token } from "../util/constants";
import { BaseRepository } from "./base.repository";

@singleton()
export class MigrationRepository extends BaseRepository<Migration> {
  private readonly stateSection = section.MIGRATIONS;

  constructor(@inject(token.GLOBAL_STATE) private readonly state: Memento) {
    super("Migration");
  }

  read(): Record<string, Group> {
    return this.state.get(this.stateSection) || {};
  }

  async write(data: Record<string, Group>): Promise<void> {
    this.state.update(this.stateSection, data);
  }
}
