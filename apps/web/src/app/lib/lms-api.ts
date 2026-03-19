const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000";

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

async function request<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new Error(message);
  }

  return response.json() as Promise<TResponse>;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(payload.message)) {
      return payload.message.join(", ");
    }

    return payload.message ?? payload.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

export function fetchPublishedCourses(): Promise<CourseCard[]> {
  return request<CourseCard[]>("/courses");
}

export function fetchDashboard(userId: string): Promise<DashboardResponse> {
  return request<DashboardResponse>(
    `/me/dashboard?userId=${encodeURIComponent(userId)}`,
  );
}

export function fetchCourseDetails(slug: string): Promise<CourseDetailsResponse> {
  return request<CourseDetailsResponse>(`/courses/${encodeURIComponent(slug)}`);
}

export function fetchCourseWorkspace(
  slug: string,
  userId: string,
): Promise<CourseWorkspaceResponse> {
  return request<CourseWorkspaceResponse>(
    `/me/courses/${encodeURIComponent(slug)}?userId=${encodeURIComponent(userId)}`,
  );
}

export function fetchCourseComments(slug: string): Promise<CourseComment[]> {
  return request<CourseComment[]>(
    `/courses/${encodeURIComponent(slug)}/comments`,
  );
}

export function createCourseComment(
  slug: string,
  payload: { userId: string; body: string },
): Promise<void> {
  return request<void>(`/courses/${encodeURIComponent(slug)}/comments`, {
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
  userId: string,
): Promise<{
  enrollmentId: string;
  lessonId: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  nextLessonTitle: string | null;
  status: string;
}> {
  return request(
    `/me/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}/complete?userId=${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
    },
  );
}
