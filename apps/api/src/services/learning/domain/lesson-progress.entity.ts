import { Entity, UniqueEntityId } from "@dimelscourse/shared-kernel";

interface LessonProgressProps {
  enrollmentId: string;
  lessonId: string;
  lessonTitle: string;
  duration: string;
  completed: boolean;
  locked?: boolean;
}

export class LessonProgress extends Entity<LessonProgressProps> {
  private constructor(id: UniqueEntityId, props: LessonProgressProps) {
    super(id, props);
  }

  get enrollmentId(): string {
    return this.props.enrollmentId;
  }

  get lessonId(): string {
    return this.props.lessonId;
  }

  markCompleted(): void {
    this.props.completed = true;
  }

  toPrimitives() {
    return {
      id: this.id.toString(),
      ...this.props,
    };
  }

  static create(props: LessonProgressProps & { id?: UniqueEntityId }): LessonProgress {
    return new LessonProgress(props.id ?? UniqueEntityId.create(), props);
  }
}
