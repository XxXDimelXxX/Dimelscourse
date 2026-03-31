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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createAdminCourse } from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (slug: string) => void;
}

export function CreateCourseModal({
  open,
  onOpenChange,
  onCreated,
}: CreateCourseModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [level, setLevel] = useState("beginner");
  const [priceUsd, setPriceUsd] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 150);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim() || !summary.trim()) {
      setError("Заполните все обязательные поля");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const course = await createAdminCourse({
        slug,
        title: title.trim(),
        summary: summary.trim(),
        level,
        priceUsd,
      });
      setTitle("");
      setSlug("");
      setSummary("");
      setLevel("beginner");
      setPriceUsd(0);
      onOpenChange(false);
      onCreated(course.slug);
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось создать курс"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Создать новый курс</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="course-title">Название *</Label>
            <Input
              id="course-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Основы Backend-разработки"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-slug">Slug (URL) *</Label>
            <Input
              id="course-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="osnovy-backend"
            />
            <p className="text-xs text-gray-500">
              Только латиница, цифры и дефисы
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-summary">Краткое описание *</Label>
            <Textarea
              id="course-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Научитесь создавать серверные приложения с нуля"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Уровень</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Начинающий</SelectItem>
                  <SelectItem value="intermediate">Средний</SelectItem>
                  <SelectItem value="advanced">Продвинутый</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-price">Цена (USD)</Label>
              <Input
                id="course-price"
                type="number"
                min={0}
                value={priceUsd}
                onChange={(e) => setPriceUsd(Number(e.target.value))}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Создание..." : "Создать курс"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
