# ShareCode

ShareCode is a modern, real-time code and text sharing application designed for speed and security. Create instant rooms, share snippets, and protect your content with passwords.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

## ✨ Features

- **🚀 Instant Room Creation**: Just visit a URL or click "create" to start sharing immediately.
- **🔒 Secure Sharing**: Password-protect your rooms to keep sensitive content safe.
- **📝 Rich Editor**: Monaco Editor integration with Markdown support for a premium editing experience.
- **⚡ Real-time Updates**: changes are saved and synced efficiently.
- **🎨 Modern UI**: Built with Shadcn UI and Tailwind CSS for a sleek, responsive design.
- **🛠️ Developer Friendly**: Full TypeScript support across the full stack.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI, Wouter, React Query.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL (via Supabase), Drizzle ORM.
- **Tooling**: TypeScript, Prettier, PostCSS.

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or bun
- A PostgreSQL database (e.g., local or Supabase)

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
    Create a `.env` file in the root directory and add your database connection string:
    ```env
    DATABASE_URL=postgresql://user:password@host:port/database
    NODE_ENV=development
    ```

4.  **Run Migrations (if applicable)**
    ```bash
    npm run db:push
    ```

5.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

## 📂 Project Structure

- `client/`: React frontend application.
- `server/`: Express backend server.
- `shared/`: Shared types and schemas (Drizzle/Zod).
- `drizzle.config.ts`: Database configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
