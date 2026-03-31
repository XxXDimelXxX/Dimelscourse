import { useEffect, useState } from "react";
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
import { updateAdminModule } from "../../lib/lms-api";
import { getErrorMessage } from "../../lib/formatters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSlug: string;
  moduleId: string;
  currentTitle: string;
  onUpdated: () => void;
}

export function EditModuleModal({
  open,
  onOpenChange,
  courseSlug,
  moduleId,
  currentTitle,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState(currentTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      setIsSaving(true);
      setError(null);
      await updateAdminModule(courseSlug, moduleId, { title: title.trim() });
      onOpenChange(false);
      onUpdated();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось обновить модуль"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать модуль</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-module-title">Название модуля</Label>
            <Input
              id="edit-module-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
