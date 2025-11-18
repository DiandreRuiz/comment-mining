import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // Removed proxy - using Vercel serverless functions instead
    // When running `vercel dev`, serverless functions handle /api routes
    // When running `npm run dev`, you can use vercel dev for full functionality
});
