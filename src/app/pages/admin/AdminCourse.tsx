import { useState } from "react";
import { mainCourse } from "../../data/courseData";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  BookOpen,
  PlayCircle,
} from "lucide-react";

export function AdminCourse() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Управление курсом
          </h1>
          <p className="text-gray-600">
            Редактирование структуры и содержания курса
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isEditing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isEditing ? (
            <>
              <X className="size-4 inline mr-2" />
              Отменить
            </>
          ) : (
            <>
              <Edit2 className="size-4 inline mr-2" />
              Режим редактирования
            </>
          )}
        </button>
      </div>

      {/* Course Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Информация о курсе
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название курса
            </label>
            <input
              type="text"
              defaultValue={mainCourse.title}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Преподаватель
            </label>
            <input
              type="text"
              defaultValue={mainCourse.instructor}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена (разовая)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                defaultValue={mainCourse.price}
                disabled={!isEditing}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена (подписка/мес)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                defaultValue={mainCourse.subscriptionPrice}
                disabled={!isEditing}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание курса
            </label>
            <textarea
              defaultValue={mainCourse.description}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
              <Save className="size-4 inline mr-2" />
              Сохранить изменения
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      {/* Course Structure */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Структура курса
          </h2>
          {isEditing && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              <Plus className="size-4 inline mr-2" />
              Добавить модуль
            </button>
          )}
        </div>

        <div className="space-y-4">
          {mainCourse.modules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Module Header */}
              <div className="bg-gray-50 p-4 flex items-center gap-3 border-b border-gray-200">
                {isEditing && (
                  <button className="cursor-grab hover:bg-gray-200 p-1 rounded">
                    <GripVertical className="size-5 text-gray-400" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  {editingModuleId === module.id ? (
                    <input
                      type="text"
                      defaultValue={module.title}
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      autoFocus
                    />
                  ) : (
                    <h3 className="font-semibold text-gray-900">
                      {module.title}
                    </h3>
                  )}
                  <p className="text-sm text-gray-500">
                    {module.lessons.length} уроков
                  </p>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingModuleId(
                          editingModuleId === module.id ? null : module.id
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      <Edit2 className="size-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition">
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Lessons */}
              <div className="divide-y divide-gray-200">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                  >
                    {isEditing && (
                      <button className="cursor-grab hover:bg-gray-200 p-1 rounded">
                        <GripVertical className="size-4 text-gray-400" />
                      </button>
                    )}
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <PlayCircle className="size-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      {editingLessonId === lesson.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            defaultValue={lesson.title}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            autoFocus
                          />
                          <input
                            type="text"
                            defaultValue={lesson.description}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            placeholder="Описание урока"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-gray-900">
                            {lesson.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {lesson.description}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.duration}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingLessonId(
                              editingLessonId === lesson.id ? null : lesson.id
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
                        >
                          <Edit2 className="size-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition">
                          <Trash2 className="size-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <button className="w-full p-4 text-left text-sm text-blue-600 hover:bg-blue-50 transition font-medium">
                    <Plus className="size-4 inline mr-2" />
                    Добавить урок в "{module.title}"
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Статистика курса
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {mainCourse.modules.length}
            </div>
            <div className="text-sm text-gray-600">Модулей в курсе</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {mainCourse.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Всего уроков</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ~{mainCourse.duration}
            </div>
            <div className="text-sm text-gray-600">Длительность</div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-bold text-yellow-900 mb-2">
          Информация для MVP
        </h3>
        <p className="text-sm text-yellow-800">
          Это упрощенная версия управления курсом для MVP. В полноценной версии
          здесь будет:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-yellow-800 list-disc list-inside">
          <li>Drag & drop для изменения порядка модулей и уроков</li>
          <li>Загрузка видео для каждого урока</li>
          <li>Загрузка дополнительных материалов (PDF, файлы)</li>
          <li>Тесты и задания к урокам</li>
          <li>Предпросмотр урока перед публикацией</li>
        </ul>
      </div>
    </div>
  );
}
