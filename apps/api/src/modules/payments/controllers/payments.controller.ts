import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../identity-access/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { AuthenticatedUser } from "../../identity-access/interfaces/authenticated-user.interface";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import { CreateCheckoutDto, createCheckoutSchema } from "../dto/create-checkout.dto";
import { PaymentsService } from "../services/payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post("checkout")
  createCheckout(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createCheckoutSchema)) dto: CreateCheckoutDto,
  ) {
    return this.paymentsService.createCheckout({
      ...dto,
      userId: user.id,
    });
  }
}
