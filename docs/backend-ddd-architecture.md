# Backend Architecture For Dimel's Course

## Почему такая декомпозиция

Ваш frontend уже показывает реальные пользовательские сценарии:

- публичный каталог курсов на главной;
- регистрация и вход;
- кабинет студента с прогрессом, активностью и достижениями;
- страница курса с уроками, ресурсами и обсуждением.

Поэтому backend удобнее всего разложить не по `controllers/services`, а по бизнес-контекстам.

## Bounded Contexts

### 1. `identity-access`

Отвечает за:

- регистрацию;
- вход;
- профиль;
- роли `student/admin`.

Главный aggregate root:

- `User`

### 2. `catalog`

Отвечает за:

- витрину курсов;
- карточку курса;
- публичные данные курса;
- преподавателя и маркетинговое описание.

Главный aggregate root:

- `Course`

### 3. `learning`

Отвечает за:

- зачисление студента на курс;
- список уроков;
- материалы;
- прохождение уроков;
- прогресс по курсу;
- дашборд студента.

Главные aggregate roots:

- `Enrollment`
- `LessonProgress`

### 4. `community` (следующий шаг)

Сейчас в коде пока не выделен отдельно, но я бы вынес его следующим модулем, когда вы начнете делать реальные комментарии:

- обсуждение курса;
- комментарии к уроку;
- модерацию.

Главный aggregate root:

- `DiscussionThread`

## Почему `progress` не вынесен в отдельный context сразу

На старте прогресс слишком тесно связан с `Enrollment` и завершением урока. Если вынести его отдельно раньше времени, у вас будет больше технической сложности, чем пользы.

Практичный старт:

- `learning` держит транзакционную модель;
- `dashboard` строится как read-model внутри `learning`;
- позже achievements, рейтинг и статистику можно выделить в `progress` или `gamification`.

## Рекомендуемая структура monorepo

```text
apps/
  web/
  api/
    src/
      contexts/
        identity-access/
        catalog/
        learning/
libs/
  shared-kernel/
```

## Слои внутри каждого context

### `domain`

Только бизнес-правила:

- entities;
- value objects;
- repository interfaces;
- domain services;
- domain events.

### `application`

Сценарии использования:

- use cases;
- commands;
- queries;
- orchestration между repository и domain.

### `infrastructure`

Технические детали:

- Nest controllers;
- persistence adapters;
- ORM models;
- integrations;
- messaging.

## Как frontend мапится на backend

### Главная страница

- `POST /auth/register`
- `POST /auth/login`
- `GET /courses`
- `GET /courses/:slug`

### Dashboard

- `GET /me/dashboard`

### Страница курса

- `GET /me/courses/:courseSlug`
- `PATCH /me/courses/:courseSlug/lessons/:lessonId/complete`

### Следующий шаг для комментариев

- `GET /courses/:slug/discussion`
- `POST /courses/:slug/discussion`

## Что бы я сделал следующим этапом

1. Подключил PostgreSQL и Prisma или TypeORM только в `infrastructure`.
2. Добавил JWT guard в `identity-access`.
3. Вывел `community` в отдельный context.
4. Разделил read-model для `dashboard` и write-model для обучения.
5. Добавил `payments/enrollments`, если курсы у вас платные.

## Важное правило для DDD в NestJS

Nest-модуль не равен bounded context автоматически.

Правильная мысль такая:

- bounded context это граница бизнес-языка;
- Nest module это техническая упаковка;
- один context можно держать в одном модуле, пока проект небольшой;
- когда вырастет, внутри context можно разделить на несколько модулей, не ломая язык домена.
