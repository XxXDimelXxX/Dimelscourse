import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";
import { UniqueEntityId } from "./unique-entity-id";

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(id: UniqueEntityId, props: Props) {
    super(id, props);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    return this.domainEvents.splice(0, this.domainEvents.length);
  }
}
