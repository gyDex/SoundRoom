# 🎶 Soundroom Backend

Backend part of the **Soundroom** music web application for real-time collaborative listening.
The project implements GraphQL API, real-time user interactions, and music content management.

## 📌 Project Status

Under active development. Basic architecture and core functionality are implemented.

## ✅ Features

* User registration and authentication (JWT, refresh token)
* Google OAuth
* Two-factor authentication (2FA)
* Management of artists, tracks, and playlists
* Favorite tracks
* Friends system and friend requests
* GraphQL API
* Real-time interactions in rooms
* WebSocket connections
* Media file handling

## 🛠 Tech Stack

* **NestJS**
* **TypeScript**
* **GraphQL (Apollo Server)**
* **WebSocket (Socket.IO)**
* **PostgreSQL**
* **TypeORM**
* **Prisma**
* **Redis**
* **JWT / Passport**
* **Supabase**
* **FFmpeg**
* **Jest**

## 🌐 Environment Variables (Backend)

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

| Variable           | Description          |
| ------------------ | -------------------- |
| DB_HOST            | PostgreSQL host      |
| DB_PORT            | PostgreSQL port      |
| DB_USERNAME        | DB user              |
| DB_PASSWORD        | DB password          |
| DB_DATABASE        | DB name              |
| SUPABASE_URL       | Supabase URL         |
| SUPABASE_KEY       | Service Role Key     |
| JWT_ACCESS_SECRET  | Access token secret  |
| JWT_REFRESH_SECRET | Refresh token secret |
| JWT_2FA_SECRET     | 2FA secret           |

## GraphQL API

Implemented using **NestJS + Apollo Server**.
GraphQL schema is generated automatically.

Main entities:

* User
* Artist
* Track
* Playlist
* FriendRequest

## ⚡ Real-time

* User actions synchronized via WebSocket
* Retrieve list of users in a room
* Real-time event exchange

## 🗄 Database Structure

Using **PostgreSQL**. Logical table structure below.

### `users`

| Field        | Type     | Description   |
| ------------ | -------- | ------------- |
| id           | UUID     | User ID       |
| email        | string   | Email         |
| password     | string   | Password hash |
| username     | string   | Username      |
| tag          | string   | Unique tag    |
| userAvatar   | string   | Avatar        |
| provider     | string   | Auth provider |
| refreshToken | string   | Refresh token |
| createdAt    | DateTime | Creation date |
| updatedAt    | DateTime | Update date   |

### `artists`

| Field    | Type   | Description |
| -------- | ------ | ----------- |
| id       | UUID   | Artist ID   |
| name     | string | Name        |
| genre    | string | Genre       |
| imageUrl | string | Cover image |

### `tracks`

| Field      | Type     | Description    |
| ---------- | -------- | -------------- |
| id         | UUID     | Track ID       |
| name       | string   | Name           |
| genre      | string   | Genre          |
| duration   | number   | Duration       |
| urlFile    | string   | Audio file URL |
| artistId   | UUID     | Artist         |
| created_at | DateTime | Creation date  |

### `playlists`

| Field     | Type     | Description   |
| --------- | -------- | ------------- |
| id        | UUID     | Playlist ID   |
| name      | string   | Name          |
| imageUrl  | string   | Cover image   |
| userId    | UUID     | Owner         |
| createdAt | DateTime | Creation date |
| updatedAt | DateTime | Update date   |

### `playlist_tracks`

| Field      | Type | Description |
| ---------- | ---- | ----------- |
| playlistId | UUID | Playlist    |
| trackId    | UUID | Track       |

### `favorites`

| Field   | Type | Description    |
| ------- | ---- | -------------- |
| userId  | UUID | User           |
| trackId | UUID | Favorite track |

### `friend_requests`

| Field       | Type     | Description   |
| ----------- | -------- | ------------- |
| id          | UUID     | Request ID    |
| requesterId | UUID     | Sender        |
| receiverId  | UUID     | Receiver      |
| createdAt   | DateTime | Creation date |

### `rooms`

| Field     | Type     | Description   |
| --------- | -------- | ------------- |
| id        | UUID     | Room ID       |
| hostId    | UUID     | Room host     |
| createdAt | DateTime | Creation date |

### `room_users`

| Field  | Type | Description |
| ------ | ---- | ----------- |
| roomId | UUID | Room        |
| userId | UUID | User        |

## 🔐 Authentication & Security

* JWT access / refresh tokens
* Two-factor authentication (TOTP)
* Password hashing (bcrypt)
* GraphQL and WebSocket endpoint protection

## 🚀 Running Locally

### Requirements

* Node.js >= 18
* npm
* PostgreSQL

### Installation

```bash
git clone https://github.com/username/soundroom-backend.git
cd soundroom-backend
npm install
```

### Running the Application

**Development**

```bash
npm run start:dev
```

**Production**

```bash
npm run build
npm run start:prod
```

### Access

* Frontend: [http://localhost:4000](http://localhost:4000)
