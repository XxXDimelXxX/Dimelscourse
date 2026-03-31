import { PlayCircle, CheckCircle2, Lock } from "lucide-react";
import { formatDurationMinutes } from "../../lib/formatters";

interface DisplayLesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  locked: boolean;
}

interface DisplayModule {
  id: string;
  title: string;
  lessons: DisplayLesson[];
}

interface LessonListProps {
  modules: DisplayModule[];
  onSelectLesson: (lessonId: string) => void;
}

export function LessonList({ modules, onSelectLesson }: LessonListProps) {
  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div key={module.id} className="border border-gray-200 rounded-lg">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">{module.title}</h4>
          </div>
          <div className="divide-y divide-gray-200">
            {module.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => !lesson.locked && onSelectLesson(lesson.id)}
                disabled={lesson.locked}
                className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition text-left ${
                  lesson.locked ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="shrink-0">
                  {lesson.locked ? (
                    <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Lock className="size-4 text-gray-500" />
                    </div>
                  ) : lesson.completed ? (
                    <div className="size-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <PlayCircle className="size-5 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lesson.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDurationMinutes(lesson.durationMinutes)}
                  </p>
                </div>
                {lesson.completed && (
                  <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    Завершено
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
