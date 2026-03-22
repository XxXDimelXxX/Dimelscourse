import { Body, Controller, Post } from "@nestjs/common";
import { CreateCheckoutDto } from "../dto/create-checkout.dto";
import { PaymentsService } from "../services/payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout")
  createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createCheckout(dto);
  }
}
