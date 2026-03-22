import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { AdminService } from "../services/admin.service";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("overview")
  getOverview() {
    return this.adminService.getOverview();
  }

  @Get("users")
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch("users/:userId/access")
  toggleUserAccess(
    @Param("userId") userId: string,
    @Body() body: { grant: boolean; courseSlug?: string },
  ) {
    return this.adminService.toggleUserAccess(userId, body);
  }

  @Get("payments")
  getPayments() {
    return this.adminService.getPayments();
  }

  @Get("course/:slug")
  getCourse(@Param("slug") slug: string) {
    return this.adminService.getCourse(slug);
  }

  @Patch("course/:slug")
  updateCourse(
    @Param("slug") slug: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      priceUsd?: number;
      subscriptionPriceUsd?: number;
      instructorName?: string;
    },
  ) {
    return this.adminService.updateCourse(slug, body);
  }
}
