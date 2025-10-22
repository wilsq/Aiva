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
// Varmistetaan, että avain on olemassa. Jos ei ole, kaadetaan käynnistys,
// ettei sovellus jää "puolitiehen".
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
// Pieni apufunktio: poimi brändi AI:n avulla
// ------------------------------------------------------------------
// Syöte: käyttäjän kirjoittama viesti (string)
// Palauttaa: { brand: "Samsung" } tai { brand: null }
async function extractBrandWithAI(message) {
  // Pyydetään mallia palauttamaan VAIN JSON-objekti {"brand": "..."}.
  // temperature=0 -> mahdollisimman deterministinen vastaus (vähemmän "kikkailua").
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_completion_tokens: 60, // HUOM! chat.completions käyttää tätä kenttää (ei max_tokens)
    messages: [
      {
        role: "system",
        content:
          'Palauta vain JSON-objekti muodossa {"brand":"LG"} tai {"brand":null}. ' +
          'Salli suomen taivutukset (esim. "Samsungin", "LG:n"). ' +
          "Tunnetut brändit: LG, Samsung, Sony, Philips, TCL, Thomson.",
      },
      { role: "user", content: message },
    ],
  });

  // Otetaan ulos mallin palauttama teksti
  const raw = (resp.choices?.[0]?.message?.content || "").trim();
  // console.log("AI raw:", raw);

  // Yritetään jäsennellä JSONiksi.
  // Jos malli vahingossa laittaa koodiblokin tms., poimitaan { ... } välistä.
  let parsed = { brand: null };
  try {
    parsed = JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) parsed = JSON.parse(m[0]);
  }

  // Normalisoidaan ulostulo: jos brand on tyhjä tai whitespace -> null
  const brand =
    typeof parsed.brand === "string" && parsed.brand.trim()
      ? parsed.brand.trim()
      : null;

  return { brand };
}

// ------------------------------------------------------------------
// POST /api/chat/search
// Pääreitti: lukee viestin, tunnistaa brändin, hakee tuotteet, palauttaa JSONin
// ------------------------------------------------------------------
router.post("/chat/search", async (req, res) => {
  console.log("POST /api/chat/search kutsuttu");
  try {
    // 1) Poimitaan viesti pyynnön bodysta (JSON).
    //    Jos viesti puuttuu -> 400 Bad Request.
    const msg = String(req.body?.message || "").trim();
    console.log("Viesti:", msg);
    if (!msg) return res.status(400).json({ error: "message required" });

    // 2) Pyydetään OpenAI:ta kertomaan, mitä brändiä viesti koskee.
    console.log("OpenAI: etsitään brand viestistä...");
    const { brand } = await extractBrandWithAI(msg);
    console.log("OpenAI brand:", brand);

    // 3) Jos brändi löytyi, haetaan MongoDB:stä tuotteet.
    //    Käytetään case-insensitive tarkkaa osumaa (Samsung == SAMSUNG).
    if (brand) {
      const products = await Product.find({
        brand: new RegExp(`^${brand}$`, "i"),
      })
        .limit(5) // rajoitetaan max 5 tuotetta demoa varten (voit säätää)
        .lean();  // palautetaan "plain JS object", nopeampi frontille

      // 4) Palautetaan data selkeästi jäsenneltynä
      return res.json({
        source: "openai",           // tieto, että brändi tuli AI:n tulkinnasta
        criteria: { brand },        // mitä hakuehtoja käytettiin
        count: products.length,     // montako tuotetta löytyi
        products,                   // itse tuotteet (JSON-lista)
      });
    }

    // 5) Jos brändiä ei tunnistettu, ei tehdä hakuja.
    return res.json({
      source: "openai",
      criteria: { brand: null },
      count: 0,
      products: [],
      message: "Valmistajaa ei tunnistettu viestistä.",
    });
  } catch (e) {
    // 6) Kaikki virheet tänne (esim. API-avaimessa vikaa, verkko-ongelma, yms.)
    console.error("chat/search ERROR:", e?.status, e?.message || e);
    return res.status(500).json({
      error: "search-failed",
      detail: e?.message || String(e),
    });
  }
});

export default router;