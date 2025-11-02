//MongoDB-tuotetiedot
import mongoose from "mongoose";

// 1. Schema kertoo, mitä kenttiä dokumentissa (tuotteessa) on
const productSchema = new mongoose.Schema(
  {
    // Meidän tuotekoodeja varten
    sku: { type: String, required: true }, // esim. "43NANO81A"

    // Valmistaja ja malli
    brand: { type: String, required: true }, // esim. "LG"
    model: { type: String, required: true }, // esim. "43NANO81A"

    // Näytön fyysiset ominaisuudet
    sizeInches: { type: Number, required: true }, // esim. 43
    displayType: { type: String }, // esim. "NanoCell", "OLED", "QLED"
    resolution: { type: String }, // esim. "4K"
    refreshRateHz: { type: Number }, // esim. 60

    // Älyominaisuudet
    platform: { type: String }, // esim. "webOS / Smart TV"
    smartTv: { type: Boolean, default: false },

    // Hinta
    price: { type: Number, required: true }, // esim. 629

    // Kuva
    imageUrl: { type: String }, // Kuvan URL

    // Ominaisuudet listana (esim. HDR, Local Dimming jne.)
    features: [{ type: String }],

    // Nimi ja kuvaus esitettäväksi frontendissä
    name: { type: String, required: true }, // esim. "LG 43NANO81A NanoCell 43\" 4K Smart TV"
    description: { type: String },
  },
  {
    // Luo automaattisesti createdAt ja updatedAt -kentät
    timestamps: true,
  }
);

// 2. Luodaan malli (Model) vain jos sitä ei ole jo olemassa
//    Kolmas parametri "products" varmistaa, että käytetään täsmälleen oikeaa kokoelmaa (AivaDB.products)
export const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");
