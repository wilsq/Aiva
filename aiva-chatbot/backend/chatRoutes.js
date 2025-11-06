//reitit, esim. POST /api/chat
import "dotenv/config";

import { Router } from "express";
import OpenAI from "openai";
// Tuodaan Mongoose-malli (käytetään tämän kautta MongoDB-hakuja)
import { Product } from "./models/productModel.js";

const router = Router();

// ------------------------------------------------------------------
// OpenAI-asiakkaan luonti
// ------------------------------------------------------------------

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY puuttuu .env:stä");
  throw new Error("OPENAI_API_KEY missing");
}

// Luodaan OpenAI-clientti. Tätä käytetään API-kutsuihin (chat completions).
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // (Valinnainen) lyhyt timeout, jotta pyyntö ei jää "roikkumaan" ikuisesti.
  timeout: 15000,
});

// ------------------------------------------------------------------
// Funktio: Yrittää tulkita käyttäjän viestistä hakukriteerit
// Käytetään GPT-mallia tulkitsemaan:
//  - brand (LG, Samsung, ...)
//  - sizeMin & sizeMax (ruutukoko tuumina)
//  - budgetMax (max hinta euroissa)
// Palauttaa: { brand, sizeMin, sizeMax, budgetMax }
// ------------------------------------------------------------------
async function extractCriteriaWithAI(message) {
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_completion_tokens: 60,
    messages: [
  {
    role: "system",
    content: `
      Palauta VAIN alla oleva JSON-muoto ilman selityksiä tai lisätekstiä:
      {
        "brand": null | "LG" | "Samsung" | "Sony" | "Philips" | "TCL" | "Thomson",
        "sizeMin": number|null,    
        "sizeMax": number|null,    
        "budgetMax": number|null,  
      }

      Säännöt:
      - Ruutukoko ilmaistaan TUUMISSA. Jos viestissä mainitaan cm, muunna tuumiksi ja pyöristä lähimpään kokonaislukuun.
      - Hinta euroissa. Palauta pelkkä numero ilman €-merkkiä, esim. "alle 800€" -> 800.
      - Ranges tulkitaan: "50–55 tuumaa" -> sizeMin=50, sizeMax=55. "vähintään 55" -> sizeMin=55.
      - Jos arvoa ei mainita, palauta null.
      - Jos viestissä mainitaan YKSI koko ilman tarkenteita (esim. "55 tuumainen", "55\""), tulkitse se TARKAKSI kooksi: aseta sizeMin = sizeMax = 55.
      - Jos käytetään tarkenteita ("vähintään", "yli", "alle", "enintään"), käytä rangea normaalisti.
      - Hyväksy suomen taivutukset: "Samsungin", "LG:n", "viiskytviis tuumaa", "alle tonnin".
      - Tunnetut brändit: LG, Samsung, Sony, Philips, TCL, Thomson.
      - ÄLÄ lisää mitään muuta tekstiä ennen tai jälkeen JSONin.
       `,
  },
  { role: "user", content: message }
]
  });

  const raw = (resp.choices?.[0]?.message?.content || "").trim();
  const json = normalizeCriteriaJSON(raw); // { brand, sizeMin, sizeMax, budgetMax }

  const { brand, sizeMin, sizeMax, budgetMax } = json;
  return { brand, sizeMin, sizeMax, budgetMax };
}

// ------------------------------------------------------------------
// Normalisointifunktiot
// Nämä varmistavat, että OpenAI:n palauttama data on käyttökelpoista
// ------------------------------------------------------------------

// Normalisoidaan hinta 
function normalizeBudget(value) {
  if (!value) return null;
  let str = String(value).toLowerCase().trim();

  // Erikoistapaus: "tonni" -> 1000
  if (str.includes("tonni")) return 1000;

  // Poista kaikki ei-numeeriset merkit
  str = str.replace(/\D+/g, "");

  return str ? Number(str) : null;
}

// Normalisoidaan kokohaarukka 
function toNum(v) {
  if ( v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeSizeRange(sizeMin, sizeMax) {
  let min = toNum(sizeMin);
  let max = toNum(sizeMax);

  // Asetetaan järkevä kokohaarukka
  const MIN_ALLOWED = 24;
  const MAX_ALLOWED = 100;

  if (min !== null && (min < MIN_ALLOWED || min > MAX_ALLOWED)) min = null;
  if (max !== null && (max < MIN_ALLOWED || max > MAX_ALLOWED)) max = null;

  // Jos molemat olemassa ja järjestys väärä, korjataan
  if (min !== null && max !== null && min > max) {
    [min, max] = [max, min];
  }

  return { sizeMin: min, sizeMax: max };
}

function normalizeCriteriaJSON(raw) {
  let parsed = {
    brand: null,
    sizeMin: null,
    sizeMax: null, 
    budgetMax: null,
  };

   try {
    parsed = JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) parsed = JSON.parse(m[0]);
  }

  // Normalisoi hinta
  parsed.budgetMax = normalizeBudget(parsed.budgetMax);
  
  // Normalisoi kokohaarukka
  const sizeRange = normalizeSizeRange(parsed.sizeMin, parsed.sizeMax);
  parsed.sizeMin = sizeRange.sizeMin;
  parsed.sizeMax = sizeRange.sizeMax;

  // Fallback: jos vain yksi koko, käytä sitä molempiin
   if (parsed.sizeMin != null && parsed.sizeMax == null) {
    parsed.sizeMax = parsed.sizeMin;
  }

  return parsed;
}

// ------------------------------------------------------------------
// POST /api/chat/search
// TÄMÄ ON KESKEINEN REITTI, jota frontti käyttää.
// ------------------------------------------------------------------

router.post("/chat/search", async (req, res) => {
  console.log("POST /api/chat/search kutsuttu");
  try {
    const msg = String(req.body?.message || "").trim();
    console.log("Viesti:", msg);
    if (!msg) return res.status(400).json({ error: "message required" });

    console.log("OpenAI: etsitään brand/hinta/koko viestistä...");

// 1) Tulkitse käyttäjän tarve AI:lla
    const { brand, budgetMax, sizeMin, sizeMax } = await extractCriteriaWithAI(msg);
    console.log("OpenAI brand:", brand);
    console.log("OpenAI max budget:", budgetMax);
    console.log("OpenAI size range :", sizeMin, "to", sizeMax);

    // 2) Rakenna MongoDB-hakukysely näiden perusteella
    const q = {};

    if (brand) {
      q.brand = new RegExp(`^${brand}$`, "i"); // tarkka case-insensitive osuma
    }

    if (sizeMin != null || sizeMax != null) {
      q.sizeInches = {};
      if (sizeMin != null) q.sizeInches.$gte = sizeMin;
      if (sizeMax != null) q.sizeInches.$lte = sizeMax;
    }

    if (budgetMax != null) {
      q.price = { $lte: budgetMax };
    }
    
    // 3) Tee haku MongoDB:stä
    const products = await Product.find(q).sort({ price: -1}).limit(10).lean();

    // 4) Lähetä tulokset frontille
      return res.json({
        source: "openai",
        criteria: { brand, budgetMax, sizeMin, sizeMax },
        count: products.length,
        products,
    });

  } catch (e) {
    console.error("chat/search ERROR:", e?.status, e?.message || e);
    return res.status(500).json({
      error: "search-failed",
      detail: e?.message || String(e),
    });
  }
});

export default router;