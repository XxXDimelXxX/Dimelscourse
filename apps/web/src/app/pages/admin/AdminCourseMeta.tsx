import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CourseSubNav } from "../../components/admin/CourseSubNav";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  fetchAdminCourseDetail,
  updateAdminCourseMeta,
  type AdminCourseDetail,
} from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

export function AdminCourseMeta() {
  const { slug } = useParams<{ slug: string }>();

  const fetcher = useCallback(
    () => fetchAdminCourseDetail(slug!),
    [slug],
  );
  const { data: course, isLoading, error } = useAsyncData<AdminCourseDetail>(fetcher, {
    enabled: Boolean(slug),
  });

  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        summary: course.summary,
        description: course.description ?? "",
        level: course.level,
        priceUsd: course.priceUsd,
        previewImageUrl: course.previewImageUrl ?? "",
        isPublished: course.isPublished,
        instructorName: course.instructorName ?? "",
      });
    }
  }, [course]);

  const handleSave = async () => {
    if (!form || !slug) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateAdminCourseMeta(slug, {
        title: form.title,
        summary: form.summary,
        description: form.description || null,
        level: form.level,
        priceUsd: form.priceUsd,
        previewImageUrl: form.previewImageUrl || null,
        isPublished: form.isPublished,
        instructorName: form.instructorName || undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(getErrorMessage(err, "Не удалось сохранить"));
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
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
        <h1 className="text-2xl font-bold text-gray-900">
          {course?.title ?? "Загрузка..."}
        </h1>
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

      {form && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Название курса</Label>
              <Input
                id="meta-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-instructor">Имя инструктора</Label>
              <Input
                id="meta-instructor"
                value={form.instructorName}
                onChange={(e) => updateField("instructorName", e.target.value)}
                placeholder="Дмитрий Иванов"
              />
            </div>

            <div className="space-y-2">
              <Label>Уровень</Label>
              <Select
                value={form.level}
                onValueChange={(v) => updateField("level", v)}
              >
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
              <Label htmlFor="meta-price">Цена (USD)</Label>
              <Input
                id="meta-price"
                type="number"
                min={0}
                value={form.priceUsd}
                onChange={(e) => updateField("priceUsd", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-image">URL превью-картинки</Label>
              <Input
                id="meta-image"
                value={form.previewImageUrl}
                onChange={(e) => updateField("previewImageUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="meta-published"
                checked={form.isPublished}
                onCheckedChange={(v) => updateField("isPublished", v)}
              />
              <Label htmlFor="meta-published" className="cursor-pointer">
                Опубликовать курс
              </Label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meta-summary">Краткое описание</Label>
              <Textarea
                id="meta-summary"
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meta-description">Полное описание</Label>
              <Textarea
                id="meta-description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                placeholder="Подробное описание курса..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Сохранить
            </Button>

            {saveSuccess && (
              <span className="text-sm text-green-600">Сохранено!</span>
            )}
            {saveError && (
              <span className="text-sm text-red-600">{saveError}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface FormState {
  title: string;
  summary: string;
  description: string;
  level: string;
  priceUsd: number;
  previewImageUrl: string;
  isPublished: boolean;
  instructorName: string;
}
