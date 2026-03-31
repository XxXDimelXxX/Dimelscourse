import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe<TOutput> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<TOutput>) {}

  transform(value: unknown): TOutput {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );

      throw new BadRequestException({
        message: errors,
        error: "Validation failed",
        statusCode: 400,
      });
    }

    return result.data;
  }
}
