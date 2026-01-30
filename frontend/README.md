# Soundroom

Музыкальное веб-приложение для прослушивания треков в индивидуальном режиме
и в формате совместного прослушивания в реальном времени.

Пользователи могут слушать музыку локально, а также объединяться в комнаты
для синхронного управления воспроизведением и взаимодействия с плеером.

Проект находится в активной разработке.

## Стек

- Next.js 15, React 19, TypeScript
- React Query
- GraphQL (graphql-request)
- REST API
- MobX
- WebSocket (socket.io)
- Ant Design, Tailwind CSS, SCSS
- React Hook Form, Zod

## Переменные окружения (Frontend)

Для запуска frontend-приложения необходимо создать файл `.env`
на основе `.env.example`.

| Переменная | Описание |
|-----------|----------|
| NEXT_PUBLIC_API_URL | URL GraphQL API |
| NEXT_PUBLIC_WS_URL | URL WebSocket сервера |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Google OAuth client ID |
| NEXT_PUBLIC_API_ENV | URL backend-сервера |

## Реализовано

- Локальное воспроизведение музыкальных треков
- Комнаты для совместного прослушивания
- Синхронизация состояния плеера между пользователями
- Работа с REST и GraphQL API
- Управление серверными и локальными состояниями
- Server-Side Rendering (Next.js)

## Статус проекта

Pet-проект / продуктовый прототип.  
Используется для демонстрации архитектурных решений и работы с real-time взаимодействиями.

## Запуск проекта локально

```bash
npm install
npm run dev
