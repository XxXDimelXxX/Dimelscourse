export function formatDateLabel(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export function formatDurationMinutes(minutes: number): string {
  return `${minutes} мин`;
}

export function levelLabel(level: string): string {
  switch (level) {
    case "beginner":
      return "Для начинающих";
    case "advanced":
      return "Продвинутый";
    default:
      return "Популярный";
  }
}

export function levelBadgeClass(level: string): string {
  switch (level) {
    case "beginner":
      return "bg-green-600";
    case "advanced":
      return "bg-purple-600";
    default:
      return "bg-blue-600";
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
