import { useCallback, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Link as LinkIcon,
  Loader2,
  File,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { CourseSubNav } from "../../components/admin/CourseSubNav";
import { ResourceUploadButton } from "../../components/admin/ResourceUploadButton";
import { DeleteConfirmDialog } from "../../components/admin/DeleteConfirmDialog";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  fetchCourseStructure,
  fetchLessonResources,
  createAdminResource,
  updateAdminResource,
  deleteAdminResource,
  type AdminCourseStructure as AdminCourseStructureType,
  type AdminModuleItem,
  type AdminResourceItem,
} from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

export function AdminCourseResources() {
  const { slug } = useParams<{ slug: string }>();

  const structureFetcher = useCallback(
    () => fetchCourseStructure(slug!),
    [slug],
  );
  const { data: structure, isLoading: structureLoading } = useAsyncData<AdminCourseStructureType>(
    structureFetcher,
    { enabled: Boolean(slug) },
  );

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Flatten lessons from structure for the selector
  const allLessons = structure?.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleName: m.title })),
  ) ?? [];

  // Auto-select first lesson
  if (!selectedLessonId && allLessons.length > 0) {
    setSelectedLessonId(allLessons[0].id);
  }

  const resourcesFetcher = useCallback(
    () => (selectedLessonId ? fetchLessonResources(selectedLessonId) : Promise.resolve([])),
    [selectedLessonId],
  );
  const {
    data: resources,
    isLoading: resourcesLoading,
    reload: reloadResources,
  } = useAsyncData<AdminResourceItem[]>(resourcesFetcher, { enabled: Boolean(selectedLessonId) });

  const [showCreate, setShowCreate] = useState(false);
  const [editResource, setEditResource] = useState<AdminResourceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminResourceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAdminResource(deleteTarget.id);
      setDeleteTarget(null);
      reloadResources();
    } catch (err) {
      alert(getErrorMessage(err, "Не удалось удалить ресурс"));
    } finally {
      setIsDeleting(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Ресурсы курса</h1>
      </div>

      <CourseSubNav slug={slug} />

      {structureLoading && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Loader2 className="size-8 animate-spin text-purple-600 mx-auto" />
        </div>
      )}

      {structure && (
        <>
          {/* Lesson selector */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
            <Label className="mb-2 block">Выберите урок</Label>
            <Select
              value={selectedLessonId ?? ""}
              onValueChange={setSelectedLessonId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите урок" />
              </SelectTrigger>
              <SelectContent>
                {structure.modules.map((mod) => (
                  <div key={mod.id}>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                      {mod.title}
                    </div>
                    {mod.lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resources list */}
          {selectedLessonId && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">Ресурсы урока</h3>
                <Button size="sm" onClick={() => setShowCreate(true)}>
                  <Plus className="size-4 mr-1" />
                  Добавить
                </Button>
              </div>

              {resourcesLoading && (
                <div className="p-8 text-center">
                  <Loader2 className="size-6 animate-spin text-gray-400 mx-auto" />
                </div>
              )}

              {resources && resources.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Нет ресурсов для этого урока
                </div>
              )}

              {resources && resources.length > 0 && (
                <div className="divide-y">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      {resource.type === "link" ? (
                        <LinkIcon className="size-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <File className="size-5 text-gray-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900">
                          {resource.title}
                        </span>
                        {resource.description && (
                          <p className="text-xs text-gray-500 truncate">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {resource.type.toUpperCase()}
                      </Badge>
                      {resource.fileSizeLabel && (
                        <span className="text-xs text-gray-500">
                          {resource.fileSizeLabel}
                        </span>
                      )}

                      {resource.type !== "link" && (
                        <ResourceUploadButton
                          lessonId={selectedLessonId}
                          resourceId={resource.id}
                          currentFileName={resource.fileOriginalName}
                          onUploadComplete={reloadResources}
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditResource(resource)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600"
                        onClick={() => setDeleteTarget(resource)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Resource Modal */}
      {selectedLessonId && (
        <ResourceFormModal
          open={showCreate}
          onOpenChange={setShowCreate}
          lessonId={selectedLessonId}
          resource={null}
          onSaved={reloadResources}
        />
      )}

      {editResource && selectedLessonId && (
        <ResourceFormModal
          open={Boolean(editResource)}
          onOpenChange={(open) => !open && setEditResource(null)}
          lessonId={selectedLessonId}
          resource={editResource}
          onSaved={reloadResources}
        />
      )}

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить ресурс?"
        description={`Ресурс "${deleteTarget?.title}" будет удален безвозвратно.`}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// ── Inline Resource Form Modal ──

function ResourceFormModal({
  open,
  onOpenChange,
  lessonId,
  resource,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  resource: AdminResourceItem | null;
  onSaved: () => void;
}) {
  const isEdit = Boolean(resource);
  const [title, setTitle] = useState(resource?.title ?? "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [type, setType] = useState(resource?.type ?? "pdf");
  const [fileUrl, setFileUrl] = useState(resource?.fileUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      setIsSaving(true);
      setError(null);
      if (isEdit && resource) {
        await updateAdminResource(resource.id, {
          title: title.trim(),
          description: description.trim() || null,
          type,
          fileUrl: type === "link" ? fileUrl.trim() || null : undefined,
        });
      } else {
        await createAdminResource(lessonId, {
          title: title.trim(),
          description: description.trim() || null,
          type,
          fileUrl: type === "link" ? fileUrl.trim() || null : null,
        });
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось сохранить ресурс"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактировать ресурс" : "Добавить ресурс"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Название</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Исходный код урока"
            />
          </div>

          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Описание ресурса..."
            />
          </div>

          <div className="space-y-2">
            <Label>Тип</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="zip">ZIP-архив</SelectItem>
                <SelectItem value="link">Ссылка</SelectItem>
                <SelectItem value="image">Изображение</SelectItem>
                <SelectItem value="video">Видео</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "link" && (
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          {type !== "link" && !isEdit && (
            <p className="text-xs text-gray-500">
              Файл можно загрузить после создания ресурса.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !title.trim()}>
            {isSaving ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
