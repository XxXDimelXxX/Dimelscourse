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
import { createAdminModule } from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSlug: string;
  onCreated: () => void;
}

export function CreateModuleModal({ open, onOpenChange, courseSlug, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      setIsSaving(true);
      setError(null);
      await createAdminModule(courseSlug, { title: title.trim() });
      setTitle("");
      onOpenChange(false);
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось создать модуль"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новый модуль</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="module-title">Название модуля</Label>
            <Input
              id="module-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Модуль 1: Основы"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !title.trim()}>
            {isSaving ? "Создание..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
