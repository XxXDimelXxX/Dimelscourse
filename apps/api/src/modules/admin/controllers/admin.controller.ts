import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { Roles } from "../../identity-access/decorators/roles.decorator";
import { UserRole } from "../../identity-access/entities/user.entity";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { RolesGuard } from "../../identity-access/guards/roles.guard";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import { ToggleAccessDto, toggleAccessSchema } from "../dto/toggle-access.dto";
import { UpdateCourseDto, updateCourseSchema } from "../dto/update-course.dto";
import { AdminService } from "../services/admin.service";

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
    @Body(new ZodValidationPipe(toggleAccessSchema)) dto: ToggleAccessDto,
  ) {
    return this.adminService.toggleUserAccess(userId, dto);
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
    @Body(new ZodValidationPipe(updateCourseSchema)) dto: UpdateCourseDto,
  ) {
    return this.adminService.updateCourse(slug, dto);
  }
}
