import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../identity-access/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { AuthenticatedUser } from "../../identity-access/interfaces/authenticated-user.interface";
import { DashboardService } from "../services/dashboard.service";

@Controller("me/dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getStudentDashboard(user.id);
  }
}
