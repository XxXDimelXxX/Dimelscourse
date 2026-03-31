import { useRef, useState } from "react";
import { Upload, Trash2, Film, Loader2 } from "lucide-react";
import { getErrorMessage } from "../../lib/formatters";
import {
  requestVideoUploadUrl,
  confirmVideoUpload,
  deleteLessonVideo,
} from "../../lib/lms-api";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

interface VideoUploadButtonProps {
  lessonId: string;
  currentVideoName: string | null;
  onUploadComplete: () => void;
}

export function VideoUploadButton({
  lessonId,
  currentVideoName,
  onUploadComplete,
}: VideoUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "confirming" | "deleting">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    event.target.value = "";

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Поддерживаются только MP4, WebM и MOV");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Максимальный размер — 500 МБ");
      return;
    }

    try {
      setError(null);
      setStatus("uploading");
      setProgress(0);

      // Step 1: Get presigned URL from backend
      const { uploadUrl, videoS3Key } = await requestVideoUploadUrl(lessonId, {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      // Step 2: Upload directly to S3 via presigned URL
      await uploadToS3(uploadUrl, file);

      // Step 3: Confirm upload to backend
      setStatus("confirming");
      await confirmVideoUpload(lessonId, {
        videoS3Key,
        originalName: file.name,
        fileSize: file.size,
      });

      setStatus("idle");
      setProgress(0);
      onUploadComplete();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось загрузить видео"));
      setStatus("idle");
      setProgress(0);
    }
  };

  const uploadToS3 = (url: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error")));

      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  const handleDelete = async () => {
    try {
      setError(null);
      setStatus("deleting");
      await deleteLessonVideo(lessonId);
      setStatus("idle");
      onUploadComplete();
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось удалить видео"));
      setStatus("idle");
    }
  };

  const isProcessing = status !== "idle";

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileSelect}
      />

      {currentVideoName ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md">
            <Film className="size-3" />
            <span className="max-w-[120px] truncate">{currentVideoName}</span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
            title="Заменить видео"
          >
            <Upload className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isProcessing}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Удалить видео"
          >
            {status === "deleting" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 border border-dashed border-gray-300 hover:border-blue-400 px-2 py-1 rounded-md transition disabled:opacity-50"
        >
          {status === "uploading" || status === "confirming" ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              {status === "uploading" ? `${progress}%` : "Сохранение..."}
            </>
          ) : (
            <>
              <Upload className="size-3" />
              Загрузить видео
            </>
          )}
        </button>
      )}

      {status === "uploading" && (
        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}