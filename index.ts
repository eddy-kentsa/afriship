
import express from "express";
import path from "path";
import type { Request, Response } from "express";
import { calculPrixColis } from "./pricing.service2";
import cors from "cors";


const app = express();

/**
 * 1️) Middleware JSON
 */
app.use(express.json());

/**
 *  2) Import de CORS pour Chrome 
 */
app.use(cors());


/**
 * 3) FRONT — page HTML AfriShip
 */
app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(process.cwd(), "public", "index.html")
  );
});

/**
 * 4) API — calcul du prix
 */
app.post("/calculate-price", (req: Request, res: Response) => {
  const { poids, codePromo } = req.body;
  const poidsNumber = Number(poids);

  const result = calculPrixColis(poidsNumber, codePromo);

  if (typeof result === "string") {
    return res.status(400).json({
      success: false,
      error: result,
    });
  }

  return res.json({
    success: true,
    price: result,
  });
});

/**
 * 4️⃣ Serveur
 */
app.listen(3000, () => {
  console.log("🚀 API AfriShip démarrée sur http://localhost:3000");
});
