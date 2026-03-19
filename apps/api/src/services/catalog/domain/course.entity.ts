import { AggregateRoot, UniqueEntityId } from "@dimelscourse/shared-kernel";

interface CourseProps {
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration: string;
  lessonCount: number;
  priceUsd: number;
  instructorName: string;
  isPublished: boolean;
}

export class Course extends AggregateRoot<CourseProps> {
  private constructor(id: UniqueEntityId, props: CourseProps) {
    super(id, props);
  }

  get slug(): string {
    return this.props.slug;
  }

  toPrimitives() {
    return {
      id: this.id.toString(),
      ...this.props,
    };
  }

  static create(props: CourseProps & { id?: UniqueEntityId }): Course {
    return new Course(props.id ?? UniqueEntityId.create(), {
      slug: props.slug,
      title: props.title,
      summary: props.summary,
      level: props.level,
      duration: props.duration,
      lessonCount: props.lessonCount,
      priceUsd: props.priceUsd,
      instructorName: props.instructorName,
      isPublished: props.isPublished,
    });
  }
}
