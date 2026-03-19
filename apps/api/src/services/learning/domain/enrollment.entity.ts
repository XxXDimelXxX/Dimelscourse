import { AggregateRoot, UniqueEntityId } from "@dimelscourse/shared-kernel";

interface EnrollmentProps {
  studentId: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  nextLessonTitle: string;
  timeLeft: string;
}

export class Enrollment extends AggregateRoot<EnrollmentProps> {
  private constructor(id: UniqueEntityId, props: EnrollmentProps) {
    super(id, props);
  }

  get courseSlug(): string {
    return this.props.courseSlug;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  completeLesson(): void {
    const nextCompletedLessons = Math.min(
      this.props.completedLessons + 1,
      this.props.totalLessons,
    );

    this.props.completedLessons = nextCompletedLessons;
    this.props.progressPercent = Math.round(
      (nextCompletedLessons / this.props.totalLessons) * 100,
    );
  }

  toPrimitives() {
    return {
      id: this.id.toString(),
      ...this.props,
    };
  }

  static create(props: EnrollmentProps & { id?: UniqueEntityId }): Enrollment {
    return new Enrollment(props.id ?? UniqueEntityId.create(), props);
  }
}
