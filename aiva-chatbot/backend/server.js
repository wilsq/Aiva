import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Schema & Model

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

// Näillä voi testata Postmanilla että yhteydet toimii

// Testataan onko serveri pystyssä, GET antaa vaan ok vastauksen jos kaikki toimii: http://localhost:5000/api/health

app.get("/api/health", (_, res) => { 
  res.json({ ok: true });
});

// Testataan onko MongoDB yhteys kunnossa, GET hakee eri tuotteiden määrän: http://localhost:5000/api/products/count

app.get("/api/products/count", async (_, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ error: "Mongo error" });
  }
});

// Testataan onko OpenAI yhteys kunnossa, POST -> body: { message: "Hei!" } JSON muodossa: http://localhost:5000/api/openai/ping

app.post("/api/openai/ping", async (req, res) => {
  try {
    const msg = String(req.body?.message || "Hei!");

    const r = await openai.responses.create({
      model: "gpt-4o-mini", // Jostain syystä gpt-5-nano ei toiminut
      input: [
        { role: "system", content: "Vastaa yhdellä lyhyellä lauseella." },
        { role: "user", content: msg }
      ],
      max_output_tokens: 40            
    });

    // Helppokäyttöinen helper: yhdistää kaikki tekstit ulos
    const text = r.output_text?.trim() || "";
    res.json({ reply: text });

    // Troubleshoottausta varten 
  } catch (e) {
    console.error("OpenAI ERROR:", e?.status, e?.message, e?.response?.data || e);
    res.status(500).json({
      error: "OpenAI error",
      status: e?.status || null,
      message: e?.message || null,
      data: e?.response?.data || null
    });
  }
});

// Yksinkertainen haku tuotteille

app.get("/api/search", async (req, res) => {
  try {
    const { sizeMin, panel, budgetMax } = req.query;
    const q = {};
    if (sizeMin) q.sizeInches = { $gte: Number(sizeMin) };
    if (panel) q.displayType = String(panel);
    if (budgetMax) q.price = { $lte: Number(budgetMax) };
    const products = await Product.find(q).limit(5).lean();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Search failed" });
  }
});

const Product = mongoose.model("Product", productSchema);

// API-reitti tuotteen hakemiseen nimen perusteella

app.get("/api/product/:name", async (req, res) => {
  try {
    console.log("Haetaan tuotetta nimellä:", req.params.name);
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (!products.length)
      return res.status(404).json({ message: "Tuotetta ei löytynyt" });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Virhe palvelimessa", error: err });
  }
});

// Käynnistä serveri vasta, kun MongoDB on yhdistetty
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas yhdistetty");

    app.listen(PORT, () => console.log(`Server käynnissä portissa ${PORT}`));
  } catch (err) {
    console.error("MongoDB yhteys virhe", err);
  }
}

startServer();