
import express from "express";
import path from "path";
import type { Request, Response } from "express";
import { calculPrixColis } from "./pricing.service2";
import cors from "cors";
import { Resend } from "resend"; /* Importer Resend */

const resend = new Resend(process.env.RESEND_API_KEY);


/**
 * On ajoute les compteurs pour tracker les leads emails de la LP
 */

let totalCalculs = 0;
let totalLeads = 0;

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
  
  totalCalculs++;
  console.log("📊 STATS", { totalCalculs, totalLeads });

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
 * 5) API — Recueil email avec Resend
 */
app.post("/lead", async (req, res) => {
  const { email, poids, typeColis, prix } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  totalLeads++;
  console.log("📊 STATS", { totalCalculs, totalLeads });

  try {
    await resend.emails.send({
      from: "AfriShip <onboarding@resend.dev>",
      to: "contact.ek.2018@gmail.com",
      subject: "📦 Nouveau lead AfriShip",
      html: `
        <h3>Nouveau lead AfriShip</h3>
        <ul>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Poids :</strong> ${poids ?? "-"}</li>
          <li><strong>Type :</strong> ${typeColis ?? "-"}</li>
          <li><strong>Prix :</strong> ${prix ?? "-"} €</li>
          <li><strong>Date :</strong> ${new Date().toLocaleString()}</li>
        </ul>
      `,
    });

    console.log("📩 EMAIL ENVOYÉ");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ ERREUR EMAIL", error);
    return res.status(500).json({ error: "Email non envoyé" });
  }
});



/**
 * 4️⃣ Serveur
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API AfriShip démarrée sur le port ${PORT}`);
});

