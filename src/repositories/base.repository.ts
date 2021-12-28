import { id } from "../util/generators";
import { partialMatch } from "../util/matchers";

export type Repository<T extends { id: string }> = {
  findAll(): T[];
  findById(id: string): T | undefined;
  find(query: Partial<T>): T[];
  create(item: Partial<T>): Promise<T>;
  update(id: string, item: T): Promise<T>;
  delete(id: string): Promise<void>;
};

export abstract class BaseRepository<T extends { id: string }> implements Repository<T> {
  constructor(private readonly entityName: string) {}

  protected abstract write(data: Record<string, T>): Promise<void>;

  protected abstract read(): Record<string, T>;

  findAll(): T[] {
    return Object.values(this.read());
  }

  findById(id: string): T | undefined {
    return this.read()[id];
  }

  find(query: Partial<T>): T[] {
    return this.findAll().filter(en => partialMatch(en, query));
  }

  async create(item: Partial<T>): Promise<T> {
    const newEntity = { ...item, id: id() } as T;
    await this.write({ ...this.read(), [newEntity.id]: newEntity });
    return newEntity;
  }

  async update(id: string, updateData: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`${this.entityName} not found`);
    }
    const updatedEntity = { ...entity, ...updateData };
    await this.write({ ...this.read(), [entity.id]: updatedEntity });

    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: _, ...newConfig } = this.read();
    await this.write(newConfig);
  }
}
