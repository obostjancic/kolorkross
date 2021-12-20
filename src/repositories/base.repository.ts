import { id } from "../util/generators";
import { partialMatch } from "../util/matchers";

export interface Repository<T extends { id: string }> {
  findAll(): T[];
  findById(id: string): T | undefined;
  find(query: Partial<T>): T[];
  create(item: Partial<T>): Promise<T>;
  update(id: string, item: T): Promise<T>;
  delete(id: string): Promise<void>;
}

export abstract class BaseRepository<T extends { id: string }> implements Repository<T> {
  private entities = {} as Record<string, T>;

  constructor(private readonly entityName: string) {
    this.entities = this.read();
  }

  protected abstract write(data: Record<string, T>): Promise<void>;

  protected abstract read(): Record<string, T>;

  protected setEntities(entities: Record<string, T>): void {
    this.entities = entities;
  }

  findAll(): T[] {
    return Object.values(this.entities);
  }

  findById(id: string): T | undefined {
    return this.entities[id];
  }

  find(query: Partial<T>): T[] {
    return this.findAll().filter(en => partialMatch(en, query));
  }

  async create(item: Partial<T>): Promise<T> {
    const newEntity = { ...item, id: id() } as T;
    await this.write({ ...this.entities, [newEntity.id]: newEntity });
    return newEntity;
  }

  async update(id: string, updateData: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`${this.entityName} not found`);
    }
    const updatedEntity = { ...entity, ...updateData };
    await this.write({ ...this.entities, [entity.id]: updatedEntity });

    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    const { [id]: _, ...newConfig } = this.entities;
    await this.write(newConfig);
  }
}
