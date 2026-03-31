import { useRef, useState } from "react";
import { Upload, File, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { requestResourceUploadUrl, confirmResourceUpload } from "../../lib/lms-api";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

interface Props {
  lessonId: string;
  resourceId: string;
  currentFileName: string | null;
  onUploadComplete: () => void;
}

export function ResourceUploadButton({
  lessonId,
  resourceId,
  currentFileName,
  onUploadComplete,
}: Props) {
  const [status, setStatus] = useState<"idle" | "uploading" | "confirming">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (file.size > MAX_FILE_SIZE) {
      setError("Файл слишком большой (макс. 50 МБ)");
      return;
    }

    try {
      setError(null);
      setStatus("uploading");
      setProgress(0);

      const { uploadUrl, s3Key } = await requestResourceUploadUrl(lessonId, {
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
      });

      // Upload to S3 via XHR for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      setStatus("confirming");
      await confirmResourceUpload(lessonId, {
        resourceId,
        s3Key,
        originalName: file.name,
        fileSize: file.size,
      });

      setStatus("idle");
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
      setStatus("idle");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {currentFileName ? (
        <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
          <File className="size-3" />
          <span className="max-w-[120px] truncate">{currentFileName}</span>
        </span>
      ) : null}

      {status === "idle" && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-3 mr-1" />
          {currentFileName ? "Заменить" : "Загрузить файл"}
        </Button>
      )}

      {status === "uploading" && (
        <span className="flex items-center gap-1 text-xs text-purple-600">
          <Loader2 className="size-3 animate-spin" />
          {progress}%
        </span>
      )}

      {status === "confirming" && (
        <span className="flex items-center gap-1 text-xs text-purple-600">
          <Loader2 className="size-3 animate-spin" />
          Сохранение...
        </span>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
