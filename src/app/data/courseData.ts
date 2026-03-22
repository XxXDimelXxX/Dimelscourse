export interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl?: string;
  description: string;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  subscriptionPrice: number; // месячная подписка
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  modules: Module[];
}

// Основной курс платформы
export const mainCourse: Course = {
  id: "fullstack-web-dev",
  title: "Full Stack Web Development",
  description:
    "Полный курс по созданию современных веб-приложений с React и Node.js. От основ до продвинутых концепций за 6 месяцев.",
  price: 299,
  subscriptionPrice: 59,
  instructor: "Дмитрий Иванов",
  rating: 4.8,
  students: 5420,
  duration: "6 месяцев",
  modules: [
    {
      id: 1,
      title: "Модуль 1: Основы HTML & CSS",
      lessons: [
        {
          id: 0,
          title: "Введение в HTML",
          duration: "15 мин",
          description:
            "Изучаем основы HTML: структура документа, основные теги, семантическая разметка.",
        },
        {
          id: 1,
          title: "HTML теги и структура",
          duration: "20 мин",
          description:
            "Углубленное изучение HTML тегов, создание правильной структуры страницы.",
        },
        {
          id: 2,
          title: "CSS стили и селекторы",
          duration: "25 мин",
          description:
            "Основы CSS: селекторы, каскадность, специфичность, базовое стилирование.",
        },
        {
          id: 3,
          title: "CSS Flexbox",
          duration: "30 мин",
          description:
            "Современная верстка с Flexbox: выравнивание, распределение пространства.",
        },
      ],
    },
    {
      id: 2,
      title: "Модуль 2: JavaScript Основы",
      lessons: [
        {
          id: 4,
          title: "Переменные и типы данных",
          duration: "20 мин",
          description:
            "Знакомство с JavaScript: переменные, примитивные типы, операторы.",
        },
        {
          id: 5,
          title: "Функции в JavaScript",
          duration: "25 мин",
          description:
            "Создание и использование функций, стрелочные функции, области видимости.",
        },
        {
          id: 6,
          title: "Массивы и объекты",
          duration: "30 мин",
          description:
            "Работа с массивами и объектами, методы массивов, деструктуризация.",
        },
        {
          id: 7,
          title: "DOM манипуляции",
          duration: "35 мин",
          description:
            "Взаимодействие с DOM: поиск элементов, изменение контента, обработка событий.",
        },
      ],
    },
    {
      id: 3,
      title: "Модуль 3: React Fundamentals",
      lessons: [
        {
          id: 8,
          title: "Введение в React",
          duration: "20 мин",
          description:
            "Что такое React, JSX, создание первого компонента.",
        },
        {
          id: 9,
          title: "Компоненты и Props",
          duration: "25 мин",
          description:
            "Создание переиспользуемых компонентов, передача данных через props.",
        },
        {
          id: 10,
          title: "State и useState",
          duration: "30 мин",
          description:
            "Управление состоянием компонента с помощью useState хука.",
        },
        {
          id: 11,
          title: "useEffect и Lifecycle",
          duration: "35 мин",
          description:
            "Жизненный цикл компонента, побочные эффекты, useEffect хук.",
        },
      ],
    },
    {
      id: 4,
      title: "Модуль 4: Backend с Node.js",
      lessons: [
        {
          id: 12,
          title: "Настройка Node.js",
          duration: "15 мин",
          description:
            "Установка Node.js, npm, создание первого сервера.",
        },
        {
          id: 13,
          title: "Express.js основы",
          duration: "25 мин",
          description:
            "Создание REST API с Express.js, роутинг, middleware.",
        },
        {
          id: 14,
          title: "REST API создание",
          duration: "30 мин",
          description:
            "Проектирование и создание RESTful API, обработка запросов.",
        },
        {
          id: 15,
          title: "База данных MongoDB",
          duration: "40 мин",
          description:
            "Подключение MongoDB, создание схем, CRUD операции.",
        },
      ],
    },
  ],
};

// Получить общее количество уроков
export function getTotalLessons(): number {
  return mainCourse.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
}

// Получить урок по индексу
export function getLessonByIndex(index: number): Lesson | null {
  let currentIndex = 0;
  for (const module of mainCourse.modules) {
    for (const lesson of module.lessons) {
      if (currentIndex === index) {
        return lesson;
      }
      currentIndex++;
    }
  }
  return null;
}

// Получить модуль и урок по общему индексу урока
export function getModuleAndLesson(lessonIndex: number): {
  module: Module;
  lesson: Lesson;
  moduleIndex: number;
  lessonIndexInModule: number;
} | null {
  let currentIndex = 0;
  for (let moduleIndex = 0; moduleIndex < mainCourse.modules.length; moduleIndex++) {
    const module = mainCourse.modules[moduleIndex];
    for (let lessonIndexInModule = 0; lessonIndexInModule < module.lessons.length; lessonIndexInModule++) {
      if (currentIndex === lessonIndex) {
        return {
          module,
          lesson: module.lessons[lessonIndexInModule],
          moduleIndex,
          lessonIndexInModule,
        };
      }
      currentIndex++;
    }
  }
  return null;
}
