import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import {
  ProcessPaymentWebhookDto,
  processWebhookSchema,
} from "../dto/process-webhook.dto";
import { PaymentsService } from "../services/payments.service";

@Controller("webhooks/payments")
export class PaymentWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  process(
    @Body(new ZodValidationPipe(processWebhookSchema))
    dto: ProcessPaymentWebhookDto,
  ) {
    return this.paymentsService.processWebhook(dto);
  }
}
