import { inject, singleton } from "tsyringe";
import { Memento } from "vscode";
import { Project } from "../models/types";
import { section, token } from "../util/constants";
import { BaseRepository } from "./base.repository";

@singleton()
export class ProjectRepository extends BaseRepository<Project> {
  private readonly stateSection = section.PROJECTS;

  constructor(@inject(token.GLOBAL_STATE) private readonly state: Memento) {
    super("Project");
  }

  read(): Record<string, Project> {
    return this.state.get(this.stateSection) || {};
  }

  async write(data: Record<string, Project>): Promise<void> {
    this.state.update(this.stateSection, data);
  }
}
