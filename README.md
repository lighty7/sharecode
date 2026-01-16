# ShareCode

**ShareCode** is a high-performance, real-time code and text sharing application designed for developers and teams. Create instant rooms, share code snippets with syntax highlighting, and protect your content with passwords—all with a premium, focused user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

---

## ✨ Key Features

- **🚀 Instant Room Creation**: Generate a unique URL instantly—no account required.
- **💻 Multi-Language Support**: Powerful Monaco Editor with syntax highlighting for dozens of programming languages.
- **🔒 Secure & Private**: Optional password protection for your rooms to keep sensitive data safe.
- **⚡ Real-time Sync**: Auto-saving ensures your work is never lost.
- **🎨 Modern Aesthetic**: beautifully designed with **Shadcn UI** and **Tailwind CSS** for a clean, dark-mode-first look.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **☁️ Production Ready**: Configured for seamless deployment on Vercel.

## 🛠️ Tech Stack

Built with a robust, type-safe stack for maximum reliability and developer experience:

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Wouter](https://github.com/molefrog/wouter) (Routing), [React Query](https://tanstack.com/query/latest) (State Management).
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/).
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/)), [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access.
- **Tooling**: [Zod](https://zod.dev/) (Validation), Prettier, PostCSS.

## 🚀 Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

- **Node.js** (v18+)
- **npm** or **bun**
- **PostgreSQL Database** (Local instance or cloud provider like Supabase/Neon)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/lighty7/sharecode.git
    cd sharecode
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory. You can copy the structure from a `.env.example` if it exists, or use the template below:
    ```env
    DATABASE_URL=postgresql://user:password@host:port/database
    NODE_ENV=development
    SESSION_SECRET=your_super_secret_session_key
    ```

4.  **Database Migration**
    Push the schema to your database:
    ```bash
    npm run db:push
    ```

5.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5000`.

## 🌍 Deployment

### Deploying to Vercel

This project is configured for Vercel out of the box (`vercel.json`).

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the **Environment Variables** (DATABASE_URL, SESSION_SECRET, etc.) in the Vercel dashboard.
4.  Deploy!

## 📂 Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application views/routes
│   │   └── hooks/       # Custom React hooks
├── server/          # Express backend
│   └── routes.ts    # API endpoints
├── shared/          # Shared Types & Schemas (Drizzle/Zod)
└── ...
```

## 🔮 Roadmap

- [ ] **Collaborative Editing**: Real-time cursor tracking and multi-user editing via WebSockets.
- [ ] **User Accounts**: Dashboard to manage your shared snippets.
- [ ] **Snippet History**: View past versions of a room's content.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
