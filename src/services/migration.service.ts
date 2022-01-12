import { inject, injectable } from "tsyringe";
import { Migration } from "../models/types";
import { Repository } from "../repositories/base.repository";
import { MigrationRepository } from "../repositories/migration.repository";

@injectable()
export class MigrationService {
  private readonly allMigrations: Partial<Migration>[] = [
    {
      name: "add-group-order",
    },
    {
      name: "delete-zombie-projects",
    },
  ];

  constructor(@inject(MigrationRepository) private readonly repo: Repository<Migration>) {}

  public async run() {
    const appliedMigrations = await this.getAppliedMigrations();
    const migrationsToApply = this.allMigrations.filter(m => !appliedMigrations.find(m2 => m2.name === m.name));

    for (const migration of migrationsToApply) {
      await this.applyMigration(migration);
    }
  }

  private async getAppliedMigrations(): Promise<Migration[]> {
    return this.repo.findAll();
  }

  private async applyMigration(migration: Partial<Migration>) {
    try {
      const migrationFunction = await import(`../util/migrations/${migration.name}`);
      await migrationFunction.default();
      await this.repo.create(migration);
    } catch (e) {
      console.error(e);
    }
  }
}
