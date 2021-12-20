import Container, { Service } from "typedi";
import { Memento } from "vscode";
import { Project } from "../models/types";
import { token } from "../util/constants";
import { BaseRepository } from "./base.repository";

@Service()
export class ProjectRepository extends BaseRepository<Project> {
  private readonly section = "dash.projects";
  private readonly state: Memento = Container.get(token.GLOBAL_STATE);

  constructor() {
    super("Project");
  }

  read(): Record<string, Project> {
    return this.state.get(this.section) || {};
  }

  async write(data: Record<string, Project>): Promise<void> {
    this.state.update(this.section, data);
  }
}
