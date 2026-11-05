import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req,res)=>res.status(200).json({ok:true,service:"Restora API"}));
app.get("/api/catalog", (_req,res)=>res.status(200).json({products:[],message:"Configure Convex to load live products."}));
app.post("/api/leads", (req,res)=>{const {name,email}=req.body??{};if(!name||!email)return res.status(400).json({error:"Name and email are required."});return res.status(202).json({accepted:true});});
export default app;