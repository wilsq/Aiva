import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB yhteys

// Schema & Model

// API-reitti tuotteen hakemiseen nimen perusteella

app.listen(PORT, () => console.log(`Server käynnissä portissa ${PORT}`));
