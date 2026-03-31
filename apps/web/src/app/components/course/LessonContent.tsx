import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
    ],
    content: parseContent(content),
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none outline-none",
      },
    },
  });

  // Update content when lesson changes
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(parseContent(content));
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <EditorContent editor={editor} />
    </div>
  );
}

function parseContent(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw);
  } catch {
    return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: raw }] }] };
  }
}
