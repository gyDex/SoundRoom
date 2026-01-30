# 🎶 Soundroom

A music web application for listening to tracks individually
or in **real-time collaborative sessions**.

Users can play music locally or join rooms
to control playback synchronously and interact with the player.

The project is under active development.

## 🛠 Tech Stack

* Next.js 15, React 19, TypeScript
* React Query
* GraphQL (`graphql-request`)
* REST API
* MobX
* WebSocket (`socket.io`)
* Ant Design, Tailwind CSS, SCSS
* React Hook Form, Zod

## 🌐 Environment Variables (Frontend)

Create a `.env` file based on `.env.example` to run the frontend.

| Variable                     | Description                 |
| ---------------------------- | --------------------------- |
| NEXT_PUBLIC_API_URL          | URL of the GraphQL API      |
| NEXT_PUBLIC_WS_URL           | URL of the WebSocket server |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Google OAuth client ID      |
| NEXT_PUBLIC_API_ENV          | URL of the backend server   |

## ✅ Implemented Features

* Local playback of music tracks
* Rooms for collaborative listening
* Player state synchronization between users
* Integration with REST and GraphQL APIs
* Management of server and local state
* Server-Side Rendering (Next.js)

## 📌 Project Status

Pet project / prototype.
Used to demonstrate architectural decisions and real-time interactions.

## 🚀 Running the Project Locally (Frontend)

### Requirements

* Node.js >= 18
* npm

### Installation

```bash
git clone https://github.com/username/soundroom-frontend.git
cd soundroom-frontend
npm install
```

### Development Mode

```bash
npm run dev
```

### Access

* API: [http://localhost:4000](http://localhost:4000)
* GraphQL Playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)
* WebSocket: ws://localhost:4000
