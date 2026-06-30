<div align="center">

  <h1>SketchHive 🎨</h1>

  <p><strong>A real-time collaborative whiteboard for drawing, sketching, and building ideas together — on an infinite canvas.</strong></p>

  <br />

  <a href="https://github.com/Dipanshu-101/SketchHive" target="_blank">
    <img src="assets/preview.png" alt="SketchHive Preview" width="100%" />
  </a>

  <br />
  <br />

  <a href="https://skillicons.dev" target="_blank">
    <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,nodejs,express,postgres,prisma,docker,git,github,vercel" alt="Tech Stack" />
  </a>

  <br />
  <br />

  <p>
    <img src="https://img.shields.io/github/stars/Dipanshu-101/SketchHive?style=for-the-badge&color=FFB000&labelColor=000000" alt="Stars" />
    <img src="https://img.shields.io/github/forks/Dipanshu-101/SketchHive?style=for-the-badge&color=3178C6&labelColor=000000" alt="Forks" />
    <img src="https://img.shields.io/github/issues/Dipanshu-101/SketchHive?style=for-the-badge&color=06B6D4&labelColor=000000" alt="Issues" />
    <img src="https://img.shields.io/github/license/Dipanshu-101/SketchHive?style=for-the-badge&color=22C55E&labelColor=000000" alt="License" />
    <img src="https://img.shields.io/github/last-commit/Dipanshu-101/SketchHive?style=for-the-badge&color=8B5CF6&labelColor=000000" alt="Last Commit" />
  </p>

  <p>
    <a href="#introduction">Introduction</a> ·
    <a href="#design">Design</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#features">Features</a> ·
    <a href="#quick-start">Quick Start</a> ·
    <a href="#future-plans">Future Plans</a>
  </p>

</div>

<br />

## <a name="introduction">🐝 Introduction</a>

**SketchHive** is a feature-rich, real-time collaborative whiteboard built on a modern, type-safe full-stack architecture. It lets multiple users join shared rooms and draw, sketch, and brainstorm together on a truly infinite canvas — with live synchronization, built-in chat, and face-to-face video calling baked right in.

Under the hood, SketchHive is powered by a Turborepo monorepo running a Next.js frontend, an Express REST backend, and a dedicated WebSocket server for real-time state, all backed by PostgreSQL through Prisma. The result is a fast, fluid, and elegant whiteboarding experience that feels native and stays in sync across every connected participant.

<br />

## <a name="design">🎨 Design</a>

SketchHive embraces a **modern glassmorphism aesthetic** — frosted, translucent surfaces layered over a deep dark theme, with soft depth and a focus on the canvas itself. The interface stays out of your way: a floating, minimal toolbar keeps drawing tools within reach without cluttering the workspace.

Every interaction is designed to feel intentional and premium. From the infinite graph-paper background to the smooth camera-based panning, the experience prioritizes clarity, focus, and flow — so the tool fades away and your ideas take center stage.

<br />

## <a name="architecture">🧱 Architecture</a>

SketchHive separates concerns across three independently deployable services, orchestrated by a single Turborepo. The client speaks REST to the HTTP backend for stateful operations, streams realtime updates over a dedicated WebSocket server, and negotiates peer-to-peer media through WebRTC for video calls.

```text
                          ┌──────────────────────────────┐
                          │          Web Client          │
                          │     Next.js · React · TS     │
                          │  Canvas · Toolbar · Chat · UI│
                          └───────────────┬──────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
              ▼                           ▼                           ▼
     ┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐
     │   HTTP Backend   │       │    WS Backend    │        │   WebRTC Peers   │
     │     Express      │       │       (ws)       │        │   Video Calling  │
     │  Auth · REST API │       │  Realtime Sync   │        │   P2P Streams    │
     └────────┬─────────┘       └────────┬─────────┘        └──────────────────┘
              │                          │
              └────────────┬─────────────┘
                           ▼
                  ┌──────────────────┐
                  │    Prisma ORM    │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │    PostgreSQL    │
                  └──────────────────┘
```

<br />

## <a name="tech-stack">⚙️ Tech Stack</a>

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>Next.js · React · TypeScript · Tailwind CSS</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Node.js · Express</td>
  </tr>
  <tr>
    <td><strong>Realtime</strong></td>
    <td>WebSockets (ws) · WebRTC</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>PostgreSQL · Prisma ORM</td>
  </tr>
  <tr>
    <td><strong>Auth</strong></td>
    <td>JWT</td>
  </tr>
  <tr>
    <td><strong>Tooling</strong></td>
    <td>Turborepo · Docker · Vercel</td>
  </tr>
</table>

<br />

## <a name="features">🔋 Features</a>

👉 **Infinite Canvas**: Instead of storing shapes relative to the screen, SketchHive uses a camera-based rendering system. Every shape lives in stable world coordinates, letting users pan infinitely in any direction while the canvas always reflects the same underlying scene.

👉 **Infinite Graph Paper Background**: A dynamic, procedurally rendered grid that scales and repositions with the camera, giving users a precise spatial reference no matter how far they pan or how much they explore.

👉 **Rich Drawing Toolkit**: A complete set of primitives — rectangle, circle, line, arrow, triangle, diamond, pencil, and text — letting users diagram, sketch, and annotate with the right tool for every idea.

👉 **Selection & Eraser Tools**: Precisely select, move, and manipulate existing shapes, or cleanly remove them with a dedicated eraser — keeping the workspace fully under the user's control.

👉 **Real-time Collaboration**: Every stroke and shape is synchronized instantly across all participants in a room through a dedicated WebSocket server, so collaborators always see the same board at the same moment.

👉 **Room System**: Authenticated users can create and join shared rooms, each acting as an isolated collaborative space with its own canvas, participants, and live session state.

👉 **Built-in Room Chat**: A real-time chat lives alongside the canvas, letting collaborators discuss ideas without ever leaving the board or breaking their creative flow.

👉 **WebRTC Video Calling**: Face-to-face peer-to-peer video calling is built directly into rooms, bringing presence and conversation to remote collaboration sessions.

👉 **JWT Authentication**: Secure, token-based authentication protects rooms and user sessions, ensuring only authorized participants can access a board and its real-time channels.

👉 **Glassmorphism Interface**: A polished, frosted-glass UI with a modern floating toolbar delivers a premium feel while keeping the canvas front and center.

👉 **Dark Theme & Responsive Design**: A refined dark theme paired with a responsive layout ensures a comfortable, consistent experience across screen sizes and lighting conditions.

👉 **Turborepo Architecture**: A clean monorepo structure shares code and configuration across the web client, HTTP backend, and WebSocket server — keeping the codebase scalable, type-safe, and easy to maintain.

<br />

## <a name="project-structure">📂 Project Structure</a>

```text
SketchHive/
│
├── apps/
│   ├── web/             # Next.js frontend (canvas, toolbar, chat, video)
│   ├── http-backend/    # Express REST API & authentication
│   └── ws-backend/      # WebSocket server for realtime sync
│
├── packages/
│   ├── ui/              # Shared UI components
│   ├── db/              # Prisma schema & client
│   ├── eslint-config/   # Shared lint configuration
│   └── typescript-config/ # Shared TS configuration
│
└── turbo.json
```

<br />

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/) (or [Docker](https://www.docker.com/))

### Clone the Repository

```bash
git clone https://github.com/Dipanshu-101/SketchHive.git
cd SketchHive
```

### Install Dependencies

```bash
pnpm install
```

<br />

## <a name="environment-variables">🔑 Environment Variables</a>

Create a `.env` file in the appropriate apps/packages and add the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sketchhive

# Auth
JWT_SECRET=your_jwt_secret

# Client → Server URLs
NEXT_PUBLIC_HTTP_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8081
```

Replace the placeholder values with your own configuration.

<br />

## <a name="running-locally">💻 Running Locally</a>

Push the Prisma schema to your database:

```bash
pnpm db:push
```

Then start the full development environment:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start sketching.

<br />

## <a name="future-plans">🚀 Future Plans</a>

SketchHive is actively evolving. On the roadmap:

- **AI Whiteboard Assistant** — generate, summarize, and refine ideas directly on the canvas
- **MCP Server Integration** — connect external tools and context through the Model Context Protocol
- **Smart Shape Recognition** — turn rough sketches into clean, precise shapes
- **Sticky Notes** — lightweight notes for brainstorming and organization
- **Export as PNG / SVG / PDF** — share and archive boards in any format
- **Version History** — browse, restore, and branch from previous board states
- **Templates** — start faster with reusable board layouts
- **Plugins** — extend SketchHive with community-built tools
- **Live Cursors** — see collaborators' pointers move in real time
- **Minimap** — navigate large boards at a glance
- **Mobile Support** — a first-class experience on phones and tablets
- **Offline Support** — keep sketching even without a connection

<br />

## <a name="contributing">🤝 Contributing</a>

Contributions are welcome and appreciated. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you'd like to change.

<br />

## <a name="license">📜 License</a>

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br />

<div align="center">

  <h3>If you find SketchHive useful, consider giving it a ⭐</h3>

  <a href="https://github.com/Dipanshu-101/SketchHive" target="_blank">
    <img src="https://img.shields.io/github/stars/Dipanshu-101/SketchHive?style=social" alt="Star on GitHub" />
  </a>

  <br />
  <br />

  <sub>Built with ❤️ by <a href="https://github.com/Dipanshu-101">Dipanshu</a></sub>

</div>