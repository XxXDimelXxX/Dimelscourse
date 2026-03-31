import { requestJson } from "./api-client";
import { authorizedRequest } from "./auth";

export interface CourseCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration: string;
  lessonCount: number;
  rating: number;
  studentsCount: number;
  priceUsd: number;
  subscriptionPriceUsd: number;
  previewImageUrl: string | null;
  instructorName: string | null;
}

export interface DashboardResponse {
  profile: {
    id: string;
    displayName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
  };
  stats: {
    activeCourses: number;
    completedLessons: number;
    studyHours: number;
    achievements: number;
  };
  courses: Array<{
    enrollmentId: string;
    courseId: string;
    courseSlug: string;
    title: string;
    progress: number;
    nextLesson: string | null;
    totalLessons: number;
    completedLessons: number;
    timeLeft: string | null;
    status: string;
  }>;
  achievements: Array<{
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string | null;
    unlockedAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    courseTitle: string | null;
    createdAt: string;
  }>;
  studyPlan: Array<{
    id: string;
    weekday: string;
    dayOfMonth: number;
    title: string;
    timeRange: string;
    courseId: string | null;
  }>;
}

export interface CourseDetailsResponse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  level: string;
  duration: string;
  lessonCount: number;
  rating: number;
  studentsCount: number;
  priceUsd: number;
  subscriptionPriceUsd: number;
  certificateAvailable: boolean;
  previewImageUrl: string | null;
  instructor: {
    id: string;
    fullName: string;
    title: string;
    bio: string | null;
    avatarUrl: string | null;
    yearsOfExperience: number;
  } | null;
  modules: Array<{
    id: string;
    title: string;
    position: number;
    lessons: Array<{
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      durationMinutes: number;
      isPreview: boolean;
      isLockedByDefault: boolean;
      position: number;
      hasVideo: boolean;
    }>;
  }>;
  resources: Array<{
    id: string;
    title: string;
    description: string | null;
    type: string;
    fileUrl: string | null;
    fileSizeLabel: string | null;
  }>;
}

export interface CourseWorkspaceResponse {
  enrollment: {
    id: string;
    status: string;
    progressPercent: number;
    completedLessons: number;
    totalLessons: number;
    nextLessonTitle: string | null;
  };
  course: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    description: string | null;
    duration: string;
    rating: number;
    studentsCount: number;
    instructor: {
      id: string;
      fullName: string;
      title: string;
      bio: string | null;
    } | null;
    modules: Array<{
      id: string;
      title: string;
      position: number;
      lessons: Array<{
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        durationMinutes: number;
        position: number;
        completed: boolean;
        locked: boolean;
        completedAt: string | null;
        videoUrl: string | null;
        content: string | null;
      }>;
    }>;
    resources: Array<{
      id: string;
      title: string;
      description: string | null;
      type: string;
      fileUrl: string | null;
      fileSizeLabel: string | null;
    }>;
  };
}

export interface CourseComment {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface PaymentResponse {
  id: string;
  userId: string;
  courseId: string;
  courseSlug: string | null;
  userEmail: string | null;
  userName: string | null;
  amountUsd: number;
  type: "one-time" | "subscription";
  status: "pending" | "success" | "failed";
  currency: string;
  transactionId: string;
  paymentMethodLabel: string | null;
  accessGranted: boolean;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOverviewResponse {
  stats: {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    completionRate: number;
  };
  recentPayments: Array<{
    id: string;
    user: string;
    amount: number;
    type: "one-time" | "subscription";
    status: "pending" | "success" | "failed";
    date: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    hasAccess: boolean;
    progress: number;
    joined: string;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  hasAccess: boolean;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  joined: string;
  lastActive: string;
  subscriptionType: "one-time" | "subscription" | "none";
}

export interface AdminPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  type: "one-time" | "subscription";
  status: "pending" | "success" | "failed";
  date: string;
  paymentMethod: string;
  transactionId: string;
}

export interface AdminCourseResponse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  priceUsd: number;
  subscriptionPriceUsd: number;
  duration: string;
  instructorName: string;
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      videoOriginalName: string | null;
      description: string | null;
      duration: string;
    }>;
  }>;
}

export function fetchPublishedCourses(): Promise<CourseCard[]> {
  return requestJson<CourseCard[]>("/courses");
}

export function fetchDashboard(): Promise<DashboardResponse> {
  return authorizedRequest<DashboardResponse>("/me/dashboard");
}

export function fetchCourseDetails(slug: string): Promise<CourseDetailsResponse> {
  return requestJson<CourseDetailsResponse>(`/courses/${encodeURIComponent(slug)}`);
}

export function fetchCourseWorkspace(
  slug: string,
): Promise<CourseWorkspaceResponse> {
  return authorizedRequest<CourseWorkspaceResponse>(
    `/me/courses/${encodeURIComponent(slug)}`,
  );
}

export function fetchCourseComments(slug: string): Promise<CourseComment[]> {
  return requestJson<CourseComment[]>(
    `/courses/${encodeURIComponent(slug)}/comments`,
  );
}

export function createCourseComment(
  slug: string,
  payload: { body: string },
): Promise<void> {
  return authorizedRequest<void>(`/courses/${encodeURIComponent(slug)}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function completeLesson(
  slug: string,
  lessonId: string,
): Promise<{
  enrollmentId: string;
  lessonId: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  nextLessonTitle: string | null;
  status: string;
}> {
  return authorizedRequest(
    `/me/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}/complete`,
    {
      method: "PATCH",
    },
  );
}

export function createCheckout(payload: {
  courseSlug: string;
  paymentType: "one-time" | "subscription";
  paymentMethodLabel?: string;
}): Promise<PaymentResponse> {
  return authorizedRequest<PaymentResponse>("/payments/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function processPaymentWebhook(payload: {
  paymentId: string;
  status: "pending" | "success" | "failed";
  eventId?: string;
  failureReason?: string;
}): Promise<PaymentResponse> {
  return requestJson<PaymentResponse>("/webhooks/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function fetchAdminOverview(): Promise<AdminOverviewResponse> {
  return authorizedRequest<AdminOverviewResponse>("/admin/overview");
}

export function fetchAdminUsers(): Promise<AdminUser[]> {
  return authorizedRequest<AdminUser[]>("/admin/users");
}

export function toggleAdminUserAccess(
  userId: string,
  payload: { grant: boolean; courseSlug?: string },
): Promise<{ success: boolean }> {
  return authorizedRequest<{ success: boolean }>(
    `/admin/users/${encodeURIComponent(userId)}/access`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}

export function fetchAdminPayments(): Promise<AdminPayment[]> {
  return authorizedRequest<AdminPayment[]>("/admin/payments");
}

export function fetchAdminCourse(slug: string): Promise<AdminCourseResponse> {
  return authorizedRequest<AdminCourseResponse>(`/admin/course/${encodeURIComponent(slug)}`);
}

export function updateAdminCourse(
  slug: string,
  payload: {
    title?: string;
    description?: string;
    priceUsd?: number;
    subscriptionPriceUsd?: number;
    instructorName?: string;
  },
): Promise<AdminCourseResponse> {
  return authorizedRequest<AdminCourseResponse>(`/admin/course/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// --- Video upload ---

export interface VideoUploadUrlResponse {
  uploadUrl: string;
  videoS3Key: string;
}

export function requestVideoUploadUrl(
  lessonId: string,
  payload: { fileName: string; contentType: string; fileSize: number },
): Promise<VideoUploadUrlResponse> {
  return authorizedRequest<VideoUploadUrlResponse>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/video/upload-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function confirmVideoUpload(
  lessonId: string,
  payload: { videoS3Key: string; originalName: string; fileSize: number },
): Promise<{ success: boolean }> {
  return authorizedRequest<{ success: boolean }>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/video/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function deleteLessonVideo(
  lessonId: string,
): Promise<{ success: boolean }> {
  return authorizedRequest<{ success: boolean }>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/video`,
    { method: "DELETE" },
  );
}

// ── Admin Courses CRUD ──

export interface AdminCourseListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  priceUsd: number;
  isPublished: boolean;
  previewImageUrl: string | null;
  lessonCount: number;
  studentsCount: number;
  instructorName: string | null;
  createdAt: string;
}

export interface AdminCourseDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  level: string;
  priceUsd: number;
  isPublished: boolean;
  previewImageUrl: string | null;
  instructorName: string | null;
  createdById: string | null;
}

export interface AdminModuleItem {
  id: string;
  title: string;
  position: number;
  lessons: AdminLessonItem[];
}

export interface AdminLessonItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  durationMinutes: number;
  position: number;
  isPreview: boolean;
  isLockedByDefault: boolean;
  isDraft: boolean;
  hasVideo: boolean;
  videoOriginalName: string | null;
  hasContent: boolean;
  content?: string | null;
}

export interface AdminCourseStructure {
  courseId: string;
  courseSlug: string;
  modules: AdminModuleItem[];
}

export interface AdminResourceItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  fileUrl: string | null;
  fileS3Key: string | null;
  fileOriginalName: string | null;
  fileSizeLabel: string | null;
  position: number;
}

export function fetchAdminCourses(): Promise<AdminCourseListItem[]> {
  return authorizedRequest<AdminCourseListItem[]>("/admin/courses");
}

export function createAdminCourse(payload: {
  slug: string;
  title: string;
  summary: string;
  level: string;
  priceUsd: number;
}): Promise<AdminCourseListItem> {
  return authorizedRequest<AdminCourseListItem>("/admin/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchAdminCourseDetail(slug: string): Promise<AdminCourseDetail> {
  return authorizedRequest<AdminCourseDetail>(`/admin/courses/${encodeURIComponent(slug)}`);
}

export function updateAdminCourseMeta(
  slug: string,
  payload: Partial<{
    title: string;
    summary: string;
    description: string | null;
    level: string;
    priceUsd: number;
    previewImageUrl: string | null;
    isPublished: boolean;
    instructorName: string;
  }>,
): Promise<AdminCourseDetail> {
  return authorizedRequest<AdminCourseDetail>(`/admin/courses/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ── Course Structure ──

export function fetchCourseStructure(slug: string): Promise<AdminCourseStructure> {
  return authorizedRequest<AdminCourseStructure>(
    `/admin/courses/${encodeURIComponent(slug)}/structure`,
  );
}

export function createAdminModule(
  slug: string,
  payload: { title: string },
): Promise<AdminModuleItem> {
  return authorizedRequest<AdminModuleItem>(
    `/admin/courses/${encodeURIComponent(slug)}/modules`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function updateAdminModule(
  slug: string,
  moduleId: string,
  payload: { title: string },
): Promise<AdminModuleItem> {
  return authorizedRequest<AdminModuleItem>(
    `/admin/courses/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function deleteAdminModule(slug: string, moduleId: string): Promise<void> {
  return authorizedRequest<void>(
    `/admin/courses/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}`,
    { method: "DELETE" },
  );
}

export function reorderAdminModule(
  slug: string,
  moduleId: string,
  direction: "up" | "down",
): Promise<void> {
  return authorizedRequest<void>(
    `/admin/courses/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}/reorder`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    },
  );
}

export function createAdminLesson(
  slug: string,
  moduleId: string,
  payload: {
    title: string;
    summary?: string | null;
    durationMinutes?: number;
    isPreview?: boolean;
    isLockedByDefault?: boolean;
    isDraft?: boolean;
  },
): Promise<AdminLessonItem> {
  return authorizedRequest<AdminLessonItem>(
    `/admin/courses/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}/lessons`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function updateAdminLesson(
  slug: string,
  lessonId: string,
  payload: Partial<{
    title: string;
    summary: string | null;
    durationMinutes: number;
    isPreview: boolean;
    isLockedByDefault: boolean;
    isDraft: boolean;
    content: string | null;
  }>,
): Promise<AdminLessonItem> {
  return authorizedRequest<AdminLessonItem>(
    `/admin/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function deleteAdminLesson(slug: string, lessonId: string): Promise<void> {
  return authorizedRequest<void>(
    `/admin/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}`,
    { method: "DELETE" },
  );
}

export function reorderAdminLesson(
  slug: string,
  lessonId: string,
  direction: "up" | "down",
): Promise<void> {
  return authorizedRequest<void>(
    `/admin/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}/reorder`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    },
  );
}

// ── Resources ──

export function fetchLessonResources(lessonId: string): Promise<AdminResourceItem[]> {
  return authorizedRequest<AdminResourceItem[]>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/resources`,
  );
}

export function createAdminResource(
  lessonId: string,
  payload: { title: string; description?: string | null; type: string; fileUrl?: string | null },
): Promise<AdminResourceItem> {
  return authorizedRequest<AdminResourceItem>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/resources`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function updateAdminResource(
  resourceId: string,
  payload: Partial<{ title: string; description: string | null; type: string; fileUrl: string | null }>,
): Promise<AdminResourceItem> {
  return authorizedRequest<AdminResourceItem>(
    `/admin/resources/${encodeURIComponent(resourceId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function deleteAdminResource(resourceId: string): Promise<void> {
  return authorizedRequest<void>(
    `/admin/resources/${encodeURIComponent(resourceId)}`,
    { method: "DELETE" },
  );
}

export function requestResourceUploadUrl(
  lessonId: string,
  payload: { fileName: string; contentType: string; fileSize: number },
): Promise<{ uploadUrl: string; s3Key: string }> {
  return authorizedRequest<{ uploadUrl: string; s3Key: string }>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/resource/upload-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export function confirmResourceUpload(
  lessonId: string,
  payload: { resourceId: string; s3Key: string; originalName: string; fileSize: number },
): Promise<void> {
  return authorizedRequest<void>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/resource/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

// ── TipTap Image Upload ──

export function requestImageUploadUrl(
  lessonId: string,
  payload: { fileName: string; contentType: string; fileSize: number },
): Promise<{ uploadUrl: string; imageKey: string; imageUrl: string }> {
  return authorizedRequest<{ uploadUrl: string; imageKey: string; imageUrl: string }>(
    `/admin/lessons/${encodeURIComponent(lessonId)}/content/image-upload-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}
