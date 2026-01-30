# Soundroom Backend

Backend-часть музыкального веб-приложения **Soundroom** для совместного прослушивания треков в реальном времени.  
Проект реализует GraphQL API, real-time взаимодействие пользователей и управление музыкальным контентом.

## Статус проекта
В активной разработке. Реализована базовая архитектура и ключевой функционал.

---

## Функциональность
- регистрация и авторизация пользователей (JWT, refresh token)
- Google OAuth
- двухфакторная аутентификация (2FA)
- управление артистами, треками и плейлистами
- избранные треки
- система друзей и заявок в друзья
- GraphQL API
- real-time взаимодействие пользователей в комнатах
- WebSocket-соединения
- работа с медиафайлами

---

## Стек технологий
- **NestJS**
- **TypeScript**
- **GraphQL (Apollo Server)**
- **WebSocket (Socket.IO)**
- **PostgreSQL**
- **TypeORM**
- **Prisma**
- **Redis**
- **JWT / Passport**
- **Supabase**
- **FFmpeg**
- **Jest**

---

## GraphQL API
API реализовано на базе **NestJS + Apollo Server**.  
Схема GraphQL генерируется автоматически.

Основные сущности:
- User
- Artist
- Track
- Playlist
- FriendRequest

---

## Real-time
- синхронизация действий пользователей через WebSocket
- получение списка подключённых пользователей в комнате
- обмен событиями в реальном времени

---

## Структура базы данных

Используется **PostgreSQL**. Ниже приведена логическая структура таблиц.

### `users`
| Поле | Тип | Описание |
|-----|----|---------|
| id | UUID | Идентификатор пользователя |
| email | string | Email |
| password | string | Хеш пароля |
| username | string | Имя пользователя |
| tag | string | Уникальный тег |
| userAvatar | string | Аватар |
| provider | string | Провайдер авторизации |
| refreshToken | string | Refresh token |
| createdAt | DateTime | Дата создания |
| updatedAt | DateTime | Дата обновления |

---

### `artists`
| Поле | Тип | Описание |
|-----|----|---------|
| id | UUID | Идентификатор артиста |
| name | string | Имя |
| genre | string | Жанр |
| imageUrl | string | Обложка |

---

### `tracks`
| Поле | Тип | Описание |
|-----|----|---------|
| id | UUID | Идентификатор трека |
| name | string | Название |
| genre | string | Жанр |
| duration | number | Длительность |
| urlFile | string | URL аудиофайла |
| artistId | UUID | Артист |
| created_at | DateTime | Дата создания |

---

### `playlists`
| Поле | Тип | Описание |
|-----|----|---------|
| id | UUID | Идентификатор плейлиста |
| name | string | Название |
| imageUrl | string | Обложка |
| userId | UUID | Владелец |
| createdAt | DateTime | Дата создания |
| updatedAt | DateTime | Дата обновления |

---

### `playlist_tracks`
| Поле | Тип | Описание |
|-----|----|---------|
| playlistId | UUID | Плейлист |
| trackId | UUID | Трек |

---

### `favorites`
| Поле | Тип | Описание |
|-----|----|---------|
| userId | UUID | Пользователь |
| trackId | UUID | Избранный трек |

---

### `friend_requests`
| Поле | Тип | Описание |
|-----|----|---------|
| id | UUID | Идентификатор |
| requesterId | UUID | Отправитель |
| receiverId | UUID | Получатель |
| createdAt | DateTime | Дата создания |

---

### `rooms`
| Поле | Тип | Описание |
|-----|----|---------|
| id | UUID | Идентификатор комнаты |
| hostId | UUID | Создатель комнаты |
| createdAt | DateTime | Дата создания |

---

### `room_users`
| Поле | Тип | Описание |
|-----|----|---------|
| roomId | UUID | Комната |
| userId | UUID | Пользователь |

---

## Аутентификация и безопасность
- JWT access / refresh tokens
- двухфакторная аутентификация (TOTP)
- хеширование паролей (bcrypt)
- защита GraphQL и WebSocket-эндпоинтов

---

## Запуск проекта локально

### 1. Клонирование репозитория
```bash
git clone https://github.com/username/soundroom-backend.git
cd soundroom-backend
