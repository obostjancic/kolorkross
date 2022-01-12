import { Repository } from "../repositories/base.repository";
import { id } from "./generators";
import { partialMatch } from "./matchers";

/* istanbul ignore next */
export class MockRepository<T extends { id: string }> implements Repository<T> {
  private entities: T[] = [];

  findAll(): T[] {
    return this.entities;
  }

  findById(id: string): T | undefined {
    return this.entities.find(en => en.id === id);
  }

  find(query: Partial<T>): T[] {
    return this.entities.filter(en => partialMatch(en, query));
  }

  findOne(query: Partial<T>): T {
    const entities = this.find(query);
    return entities?.[0];
  }

  create(entity: Partial<T>): Promise<T> {
    const newEntity = { ...entity, id: id() } as T;
    this.entities.push(newEntity);
    return Promise.resolve(newEntity);
  }

  update(id: string, entity: T): Promise<T> {
    const index = this.entities.findIndex(en => en.id === id);
    if (index === -1) {
      throw new Error("T not found");
    }
    this.entities[index] = entity;
    return Promise.resolve(entity);
  }

  delete(id: string): Promise<void> {
    const index = this.entities.findIndex(en => en.id === id);
    if (index === -1) {
      throw new Error("T not found");
    }
    this.entities.splice(index, 1);
    return Promise.resolve();
  }
}

export class MockMemento {
  private state: Record<string, any> = {};

  get(key: string): any {
    return this.state[key];
  }

  update(key: string, value: any): void {
    this.state[key] = value;
  }
}
