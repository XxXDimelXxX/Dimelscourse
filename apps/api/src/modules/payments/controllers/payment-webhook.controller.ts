import { Body, Controller, Post } from "@nestjs/common";
import { ProcessPaymentWebhookDto } from "../dto/process-webhook.dto";
import { PaymentsService } from "../services/payments.service";

@Controller("webhooks/payments")
export class PaymentWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  process(@Body() dto: ProcessPaymentWebhookDto) {
    return this.paymentsService.processWebhook(dto);
  }
}
