import { ValueObject } from "@dimelscourse/shared-kernel";

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(rawValue: string): Email {
    const value = rawValue.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error("Invalid email format");
    }

    return new Email({ value });
  }
}
