import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Code,
  Quote,
  ImageIcon,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { Button } from "../ui/button";
import { requestImageUploadUrl } from "../../lib/lms-api";

interface Props {
  lessonId: string;
  courseSlug: string;
  initialContent: string | null;
  onChange: (content: string | null) => void;
}

export function LessonContentEditor({
  lessonId,
  courseSlug,
  initialContent,
  onChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      Placeholder.configure({
        placeholder: "Начните писать статью к уроку...",
      }),
    ],
    content: initialContent ? JSON.parse(initialContent) : undefined,
    onUpdate: ({ editor: e }) => {
      const json = JSON.stringify(e.getJSON());
      onChange(json);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none min-h-[300px] p-4 outline-none focus:outline-none",
      },
    },
  });

  // Sync initial content when lesson changes
  const prevLessonId = useRef(lessonId);
  useEffect(() => {
    if (editor && lessonId !== prevLessonId.current) {
      prevLessonId.current = lessonId;
      if (initialContent) {
        editor.commands.setContent(JSON.parse(initialContent));
      } else {
        editor.commands.clearContent();
      }
    }
  }, [editor, lessonId, initialContent]);

  const handleImageUpload = async (file: File) => {
    if (!editor) return;

    try {
      const { uploadUrl, imageUrl } = await requestImageUploadUrl(lessonId, {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      // Upload directly to S3
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch {
      // Silent fail for now — user can retry
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = "";
    }
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50 rounded-t-lg">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Жирный"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Курсив"
        >
          <Italic className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Заголовок 2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Заголовок 3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Маркированный список"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Нумерованный список"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Блок кода"
        >
          <Code className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Цитата"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Разделитель"
        >
          <Minus className="size-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Вставить изображение"
        >
          <ImageIcon className="size-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Отменить"
        >
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Повторить"
        >
          <Redo className="size-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input for images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-8 w-8 p-0 ${active ? "bg-purple-100 text-purple-700" : ""}`}
    >
      {children}
    </Button>
  );
}
