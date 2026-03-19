
# Dimel's Course

Monorepo для образовательной платформы с frontend на React/Vite и backend на NestJS в DDD-стиле.

## Структура

```text
apps/
  api/   NestJS backend с bounded contexts
  web/   React/Vite frontend из Figma
libs/
  shared-kernel/   базовые DDD-абстракции
docs/
  backend-ddd-architecture.md
```

## Домены

- `identity-access` отвечает за регистрацию, вход, профиль и роли.
- `catalog` отвечает за публичный каталог курсов и карточку курса.
- `learning` отвечает за зачисление, прохождение уроков, ресурсы и дашборд студента.
- `community` пока описан в документации как следующий шаг для комментариев и обсуждений.

## Запуск

1. Выполнить `npm install`.
2. Поднять frontend: `npm run dev:web`.
3. Поднять backend: `npm run dev:api`.

## Архитектура

Подробная карта контекстов, агрегатов, API и правил разделения лежит в [docs/backend-ddd-architecture.md](docs/backend-ddd-architecture.md).
  
