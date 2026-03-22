import { Controller, Get, Query } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";

@Controller("me/dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Query("userId") userId: string) {
    return this.dashboardService.getStudentDashboard(userId);
  }
}
