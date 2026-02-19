# Troubleshooting Login Issues

If you are experiencing issues with login (both locally and in deployment), please follow these steps:

## 1. Check MongoDB Connection
The most common cause of login failure is a missing or incorrect `MONGO_URI`.
- **Locally**: Ensure you have a `.env` file in the root directory with `MONGO_URI=mongodb://...`.
- **Deployment**: Ensure you have set the `MONGO_URI` environment variable in your Vercel/hosting dashboard.
- **Check Status**: Visit `http://localhost:5000/api/status` (local) or `https://your-app.vercel.app/api/status` (production) to see if the database is connected (`dbState: 1`).

## 2. Check API URL
In `src/api.ts`, verify the `API_BASE_URL` logic. 
- If your frontend and backend are on different domains, the relative path `/api` won't work in production.
- Current config:
  ```typescript
  const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
  ```

## 3. Seed the Database
If you haven't created an account yet, the login will fail.
- **Option A (Preserve Data)**: Run `npx tsx scripts/create-demo-user.ts` to simply add a demo user (`demo@rupeex.com` / `demo123`).
- **Option B (Reset Data)**: Run `npm run seed:db` to wipe the DB and recreate demo data.
  - **Email**: `demo@rupeex.com`
  - **Password**: `demo123`

## 4. Check Browser Console
- Open Developer Tools (F12) -> Console.
- Look for "Network Error" or "401 Unauthorized" or "500 Server Error".
- If it says "Network Error", the frontend cannot reach the backend. Check if the server is running on port 5000.

## 5. Deployment Specifics (Vercel)
- Ensure all environment variables (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`) are added in Vercel.
- Check Vercel logs in the dashboard to see server-side errors.
