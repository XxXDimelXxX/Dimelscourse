import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  constructor(private readonly value: string) {
    if (!value.trim()) {
      throw new Error("Entity id cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: UniqueEntityId): boolean {
    return this.value === other.value;
  }

  static create(value?: string): UniqueEntityId {
    return new UniqueEntityId(value ?? randomUUID());
  }
}
