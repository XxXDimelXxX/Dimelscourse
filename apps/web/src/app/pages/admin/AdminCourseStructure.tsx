import { useCallback, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  FileText,
  Eye,
  Loader2,
  GripVertical,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CourseSubNav } from "../../components/admin/CourseSubNav";
import { VideoUploadButton } from "../../components/admin/VideoUploadButton";
import { CreateModuleModal } from "../../components/admin/CreateModuleModal";
import { EditModuleModal } from "../../components/admin/EditModuleModal";
import { CreateLessonModal } from "../../components/admin/CreateLessonModal";
import { EditLessonModal } from "../../components/admin/EditLessonModal";
import { DeleteConfirmDialog } from "../../components/admin/DeleteConfirmDialog";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  fetchCourseStructure,
  deleteAdminModule,
  deleteAdminLesson,
  reorderAdminModule,
  reorderAdminLesson,
  type AdminCourseStructure as AdminCourseStructureResponse,
  type AdminModuleItem,
  type AdminLessonItem,
} from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

export function AdminCourseStructure() {
  const { slug } = useParams<{ slug: string }>();

  const fetcher = useCallback(
    () => fetchCourseStructure(slug!),
    [slug],
  );
  const { data: structure, isLoading, error, reload } = useAsyncData<AdminCourseStructureResponse>(fetcher, {
    enabled: Boolean(slug),
  });

  // Modal states
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [editModule, setEditModule] = useState<AdminModuleItem | null>(null);
  const [deleteModuleTarget, setDeleteModuleTarget] = useState<AdminModuleItem | null>(null);
  const [createLessonModuleId, setCreateLessonModuleId] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<AdminLessonItem | null>(null);
  const [deleteLessonTarget, setDeleteLessonTarget] = useState<AdminLessonItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const handleDeleteModule = async () => {
    if (!deleteModuleTarget || !slug) return;
    try {
      setIsDeleting(true);
      await deleteAdminModule(slug, deleteModuleTarget.id);
      setDeleteModuleTarget(null);
      reload();
    } catch (err) {
      alert(getErrorMessage(err, "Не удалось удалить модуль"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonTarget || !slug) return;
    try {
      setIsDeleting(true);
      await deleteAdminLesson(slug, deleteLessonTarget.id);
      setDeleteLessonTarget(null);
      reload();
    } catch (err) {
      alert(getErrorMessage(err, "Не удалось удалить урок"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorderModule = async (moduleId: string, direction: "up" | "down") => {
    if (!slug) return;
    try {
      setReorderingId(moduleId);
      await reorderAdminModule(slug, moduleId, direction);
      reload();
    } finally {
      setReorderingId(null);
    }
  };

  const handleReorderLesson = async (lessonId: string, direction: "up" | "down") => {
    if (!slug) return;
    try {
      setReorderingId(lessonId);
      await reorderAdminLesson(slug, lessonId, direction);
      reload();
    } finally {
      setReorderingId(null);
    }
  };

  if (!slug) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Link
          to="/admin/courses"
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Структура курса</h1>
      </div>

      <CourseSubNav slug={slug} />

      {isLoading && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Loader2 className="size-8 animate-spin text-purple-600 mx-auto" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {structure && (
        <div className="space-y-4">
          {structure.modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              {/* Module header */}
              <div className="flex items-center gap-3 p-4 border-b bg-gray-50 rounded-t-xl">
                <GripVertical className="size-4 text-gray-400" />
                <h3 className="font-semibold text-gray-900 flex-1">
                  {mod.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {mod.lessons.length} уроков
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleReorderModule(mod.id, "up")}
                    disabled={modIdx === 0 || reorderingId === mod.id}
                    title="Вверх"
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleReorderModule(mod.id, "down")}
                    disabled={
                      modIdx === structure.modules.length - 1 ||
                      reorderingId === mod.id
                    }
                    title="Вниз"
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setEditModule(mod)}
                    title="Редактировать"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => setDeleteModuleTarget(mod)}
                    title="Удалить"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y">
                {mod.lessons.map((lesson, lessonIdx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <PlayCircle
                      className={`size-5 flex-shrink-0 ${
                        lesson.hasVideo ? "text-purple-500" : "text-gray-300"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {lesson.title}
                        </span>
                        {lesson.isDraft && (
                          <Badge variant="secondary" className="text-xs">
                            Черновик
                          </Badge>
                        )}
                        {lesson.isPreview && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-700 border-green-300"
                          >
                            <Eye className="size-3 mr-1" />
                            Превью
                          </Badge>
                        )}
                        {lesson.hasContent && (
                          <FileText className="size-3.5 text-blue-500" />
                        )}
                      </div>
                      {lesson.durationMinutes > 0 && (
                        <span className="text-xs text-gray-500">
                          {lesson.durationMinutes} мин
                        </span>
                      )}
                    </div>

                    <VideoUploadButton
                      lessonId={lesson.id}
                      currentVideoName={lesson.videoOriginalName}
                      onUploadComplete={reload}
                    />

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleReorderLesson(lesson.id, "up")}
                        disabled={lessonIdx === 0 || reorderingId === lesson.id}
                      >
                        <ChevronUp className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleReorderLesson(lesson.id, "down")}
                        disabled={
                          lessonIdx === mod.lessons.length - 1 ||
                          reorderingId === lesson.id
                        }
                      >
                        <ChevronDown className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditLesson(lesson)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        onClick={() => setDeleteLessonTarget(lesson)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {mod.lessons.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">
                    Нет уроков. Добавьте первый урок.
                  </div>
                )}
              </div>

              {/* Add lesson button */}
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={() => setCreateLessonModuleId(mod.id)}
                >
                  <Plus className="size-4 mr-2" />
                  Добавить урок
                </Button>
              </div>
            </div>
          ))}

          {/* Add module button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowCreateModule(true)}
          >
            <Plus className="size-4 mr-2" />
            Добавить модуль
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateModuleModal
        open={showCreateModule}
        onOpenChange={setShowCreateModule}
        courseSlug={slug}
        onCreated={reload}
      />

      {editModule && (
        <EditModuleModal
          open={Boolean(editModule)}
          onOpenChange={(open) => !open && setEditModule(null)}
          courseSlug={slug}
          moduleId={editModule.id}
          currentTitle={editModule.title}
          onUpdated={reload}
        />
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteModuleTarget)}
        onOpenChange={(open) => !open && setDeleteModuleTarget(null)}
        title="Удалить модуль?"
        description={`Модуль "${deleteModuleTarget?.title}" и все его уроки будут удалены безвозвратно.`}
        onConfirm={handleDeleteModule}
        isDeleting={isDeleting}
      />

      {createLessonModuleId && (
        <CreateLessonModal
          open={Boolean(createLessonModuleId)}
          onOpenChange={(open) => !open && setCreateLessonModuleId(null)}
          courseSlug={slug}
          moduleId={createLessonModuleId}
          onCreated={reload}
        />
      )}

      {editLesson && (
        <EditLessonModal
          open={Boolean(editLesson)}
          onOpenChange={(open) => !open && setEditLesson(null)}
          courseSlug={slug}
          lesson={editLesson}
          onUpdated={reload}
        />
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteLessonTarget)}
        onOpenChange={(open) => !open && setDeleteLessonTarget(null)}
        title="Удалить урок?"
        description={`Урок "${deleteLessonTarget?.title}" будет удален безвозвратно вместе с видео и контентом.`}
        onConfirm={handleDeleteLesson}
        isDeleting={isDeleting}
      />
    </div>
  );
}
