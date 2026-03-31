import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { formatDateShort, getErrorMessage } from "../../lib/formatters";
import { createCourseComment, fetchCourseComments, type CourseComment } from "../../lib/lms-api";

interface CommentsSectionProps {
  courseSlug: string;
  comments: CourseComment[];
  onCommentsUpdate: (comments: CourseComment[]) => void;
  isAuthenticated: boolean;
  onError: (message: string) => void;
}

export function CommentsSection({
  courseSlug,
  comments,
  onCommentsUpdate,
  isAuthenticated,
  onError,
}: CommentsSectionProps) {
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentBody.trim()) return;

    try {
      setIsSubmitting(true);
      await createCourseComment(courseSlug, { body: commentBody.trim() });
      setCommentBody("");
      const nextComments = await fetchCourseComments(courseSlug);
      onCommentsUpdate(nextComments);
    } catch (error) {
      onError(getErrorMessage(error, "Не удалось отправить комментарий"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="size-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Обсуждение</h3>
        <span className="text-sm text-gray-500">({comments.length})</span>
      </div>

      <div className="space-y-4">
        {comments.length ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="size-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-semibold">
                {comment.author.displayName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {comment.author.displayName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDateShort(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-600">{comment.body}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">Комментариев пока нет.</div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        {isAuthenticated ? (
          <>
            <textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Добавить комментарий..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                disabled={isSubmitting || !commentBody.trim()}
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60"
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">
            Чтобы писать комментарии и отмечать уроки, войдите в аккаунт.
          </div>
        )}
      </div>
    </div>
  );
}
