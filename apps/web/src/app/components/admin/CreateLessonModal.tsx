import { useState } from "react";
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
import { createAdminLesson } from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSlug: string;
  moduleId: string;
  onCreated: () => void;
}

export function CreateLessonModal({
  open,
  onOpenChange,
  courseSlug,
  moduleId,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      setIsSaving(true);
      setError(null);
      await createAdminLesson(courseSlug, moduleId, {
        title: title.trim(),
        summary: summary.trim() || null,
        durationMinutes,
        isPreview,
        isLockedByDefault: true,
        isDraft,
      });
      setTitle("");
      setSummary("");
      setDurationMinutes(0);
      setIsPreview(false);
      setIsDraft(true);
      onOpenChange(false);
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось создать урок"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Новый урок</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Название урока *</Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введение в Node.js"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-summary">Краткое описание</Label>
            <Textarea
              id="lesson-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="О чем этот урок..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-duration">Длительность (мин)</Label>
            <Input
              id="lesson-duration"
              type="number"
              min={0}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="lesson-preview"
                checked={isPreview}
                onCheckedChange={setIsPreview}
              />
              <Label htmlFor="lesson-preview" className="cursor-pointer">
                Бесплатный превью
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="lesson-draft"
                checked={isDraft}
                onCheckedChange={setIsDraft}
              />
              <Label htmlFor="lesson-draft" className="cursor-pointer">
                Черновик
              </Label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !title.trim()}>
            {isSaving ? "Создание..." : "Создать урок"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
