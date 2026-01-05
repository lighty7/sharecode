# CodeVault

A secure, dark-themed code sharing application.

## Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database

## Local Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   Create a `.env` file in the root directory and add your `DATABASE_URL`:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/codevault
   ```
4. **Database Setup**
   Push the schema to your database:
   ```bash
   npm run db:push
   ```
5. **Run the application**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`.

## Deployment

### Backend (Render / Heroku)

1. **Connect your GitHub repository** to Render.
2. **Create a Web Service**.
3. **Environment Variables**: Add `DATABASE_URL` and `NODE_ENV=production`.
4. **Build Command**: `npm run build`
5. **Start Command**: `npm run start`

### Frontend (Netlify / Vercel)

Since this is a full-stack application with a shared backend, it's recommended to deploy the entire app to a platform like Render or Railway. However, if you want to split them:

1. **Netlify/Vercel**: Deploy the `client` folder.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist/public`
4. **API Proxy**: Configure a proxy or set `VITE_API_URL` to your backend service.

## Recommended Database

We recommend using **PostgreSQL** (specifically **Neon** or **Supabase** for managed hosting). 

- **Neon**: Great for serverless applications and integrates perfectly with Replit.
- **Supabase**: Offers a full backend suite if you need more than just a database.

The app uses **Drizzle ORM**, making it compatible with any PostgreSQL provider.
