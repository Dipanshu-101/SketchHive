# SketchHive 🎨

A real-time collaborative whiteboard application where multiple users can draw, sketch, and collaborate together in shared rooms.

> Currently under active development.

---

## ✨ Features

### Current

* Monorepo architecture using Turborepo
* Next.js frontend
* Express backend
* WebSocket server for real-time communication
* TypeScript across the stack

### Planned

* Real-time collaborative drawing
* Multiple rooms/boards
* User authentication
* Persistent board storage
* Cursor presence indicators
* Shape tools (rectangle, circle, line)
* Undo / Redo
* Dark mode
* Board sharing
* Export board as image/PDF

---

## 🏗️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express

### Realtime

* WebSockets (`ws`)

### Database

* PostgreSQL

### Monorepo

* Turborepo

---

## 📂 Project Structure

```text
SketchHive/
│
├── apps/
│   ├── web/            # Next.js frontend
│   ├── http-backend/   # REST APIs
│   └── ws-backend/     # WebSocket server
│
├── packages/
│   ├── ui/
│   ├── eslint-config/
│   └── typescript-config/
│
└── turbo.json
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd SketchHive
```

### Install Dependencies

```bash
pnpm install
```

### Run Development Environment

```bash
pnpm run dev
```

---

## 📌 Development Roadmap

### Phase 1

* [x] Turborepo setup
* [x] Next.js setup
* [x] Express server setup
* [x] WebSocket server setup

### Phase 2

* [ ] Canvas implementation
* [ ] Drawing tools
* [ ] Real-time synchronization

### Phase 3

* [ ] Authentication
* [ ] Database integration
* [ ] Board persistence

### Phase 4

* [ ] Sharing and collaboration features
* [ ] Performance optimizations
* [ ] Production deployment

---

## 🎯 Project Goal

The goal of SketchHive is to understand and implement modern full-stack development concepts including:

* Monorepos
* WebSockets
* Real-time systems
* Authentication
* Database management
* Scalable architecture
* Deployment workflows

---

## 📜 License

MIT License
