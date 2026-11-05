import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Restora API", timestamp: new Date().toISOString() }));
app.get("/api/catalog", (_req, res) => res.json({ products: [], message: "Connect Convex to load the live catalog." }));
app.post("/api/leads", (req, res) => {
  const { name, email, phone, message } = req.body ?? {};
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });
  // Production lead persistence is handled by the Convex mutation once the deployment URL is configured.
  return res.status(202).json({ accepted: true, lead: { name, email, phone: phone ?? "", message: message ?? "" } });
});
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Restora API listening on ${port}`));