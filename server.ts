import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import { generateDailyReport } from "./src/services/gemini";
import { format } from "date-fns";

// Placeholder for KakaoTalk API logic
async function sendKakaoTalkMessage(email: string, message: string) {
  console.log(`Sending message to ${email}:`, message);
  // TODO: Implement KakaoTalk API integration here
  // You need to register an app on Kakao Developers and use their API
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route to trigger report generation manually
  app.post("/api/generate-report", async (req, res) => {
    try {
      const dateString = format(new Date(), "yyyy-MM-dd");
      const content = await generateDailyReport(dateString);
      await sendKakaoTalkMessage("paz0909@naver.com", content);
      res.json({ success: true, content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to generate report" });
    }
  });

  // Cron job: Run every day at 7:00 AM
  cron.schedule("0 7 * * *", async () => {
    console.log("Running daily report generation...");
    try {
      const dateString = format(new Date(), "yyyy-MM-dd");
      const content = await generateDailyReport(dateString);
      await sendKakaoTalkMessage("paz0909@naver.com", content);
      console.log("Daily report generated and sent successfully.");
    } catch (error) {
      console.error("Error in daily cron job:", error);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
