import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
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
