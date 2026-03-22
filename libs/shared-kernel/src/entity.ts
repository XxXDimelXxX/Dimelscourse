import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
  protected constructor(
    public readonly id: UniqueEntityId,
    protected props: Props,
  ) {}

  get snapshot(): Readonly<Props> {
    return Object.freeze({ ...this.props });
  }

  equals(other: Entity<Props>): boolean {
    return this.id.equals(other.id);
  }
}
