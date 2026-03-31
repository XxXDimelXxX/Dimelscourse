import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Save, Loader2 } from "lucide-react";
import { LessonContentEditor } from "./LessonContentEditor";
import { updateAdminLesson, type AdminLessonItem } from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSlug: string;
  lesson: AdminLessonItem | null;
  onUpdated: () => void;
}

export function EditLessonModal({
  open,
  onOpenChange,
  courseSlug,
  lesson,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isLockedByDefault, setIsLockedByDefault] = useState(true);
  const [isDraft, setIsDraft] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setSummary(lesson.summary ?? "");
      setDurationMinutes(lesson.durationMinutes);
      setIsPreview(lesson.isPreview);
      setIsLockedByDefault(lesson.isLockedByDefault);
      setIsDraft(lesson.isDraft);
      setContent(lesson.content ?? null);
      setError(null);
      setSaveSuccess(false);
    }
  }, [lesson]);

  const handleSave = useCallback(async () => {
    if (!lesson) return;
    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);
      await updateAdminLesson(courseSlug, lesson.id, {
        title: title.trim(),
        summary: summary.trim() || null,
        durationMinutes,
        isPreview,
        isLockedByDefault,
        isDraft,
        content,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onUpdated();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось сохранить урок"));
    } finally {
      setIsSaving(false);
    }
  }, [
    lesson,
    courseSlug,
    title,
    summary,
    durationMinutes,
    isPreview,
    isLockedByDefault,
    isDraft,
    content,
    onUpdated,
  ]);

  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать урок</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-title">Название урока</Label>
              <Input
                id="edit-lesson-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lesson-summary">Краткое описание</Label>
              <Textarea
                id="edit-lesson-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lesson-duration">Длительность (мин)</Label>
              <Input
                id="edit-lesson-duration"
                type="number"
                min={0}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-preview"
                  checked={isPreview}
                  onCheckedChange={setIsPreview}
                />
                <Label htmlFor="edit-preview" className="cursor-pointer">
                  Бесплатный превью
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="edit-locked"
                  checked={isLockedByDefault}
                  onCheckedChange={setIsLockedByDefault}
                />
                <Label htmlFor="edit-locked" className="cursor-pointer">
                  Заблокирован по умолчанию
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="edit-draft"
                  checked={isDraft}
                  onCheckedChange={setIsDraft}
                />
                <Label htmlFor="edit-draft" className="cursor-pointer">
                  Черновик
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="py-4">
            <LessonContentEditor
              lessonId={lesson.id}
              courseSlug={courseSlug}
              initialContent={content}
              onChange={setContent}
            />
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter>
          {saveSuccess && (
            <span className="text-sm text-green-600 mr-auto">Сохранено!</span>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Закрыть
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Save className="size-4 mr-2" />
            )}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
