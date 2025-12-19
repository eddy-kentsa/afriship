
import { useState } from "react";

function App() {
  const [poids, setPoids] = useState("");
  const [codePromo, setCodePromo] = useState("");
  const [typeColis, setTypeColis] = useState("");
  const [prix, setPrix] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);




  const calculerPrix = async () => {

    if (!poids || Number(poids) <= 0) {
      setError("Veuillez entrer un poids valide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://afriship-api.onrender.com/calculate-price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            poids: Number(poids), 
            codePromo }),
        }
      );

      const data = await response.json();
      setPrix(data.price);
    } catch (err) {
      setError("Erreur lors du calcul");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>AfriShip</h1>
      <p>Calculez le prix de votre colis</p>

      <input
        type="number"
        placeholder="Poids en kg"
        value={poids}
        onChange={(e) => setPoids(e.target.value)}
      />

      <br /><br />


      <input
        type="text"
        placeholder="Code Promo"
        value={codePromo}
        onChange={(e) => setCodePromo(e.target.value)}
      />

      <br /><br />

      <label>
        Type de colis :  
        <select
          value={typeColis}
          onChange={(e) => setTypeColis(e.target.value)}
        >
          <option value="">-- Sélectionnez --</option>
          <option value="Documents">Documents</option>
          <option value="Vêtements">Vêtements</option>
          <option value="Électronique">Électronique</option>
          <option value="Produits alimentaires">Produits alimentaires</option>
          <option value="Médicaments">Médicaments</option>
          <option value="Cosmétiques">Cosmétiques</option>
          <option value="Livres">Livres</option>
          <option value="Bijoux">Bijoux</option>
          <option value="Artisanat">Artisanat</option>
          <option value="Autre (à préciser)">Autre (à préciser)</option>
        </select>
      </label>
      <br /><br />
      console.log("Type colis :", typeColis);


      <button onClick={calculerPrix} disabled={loading}>
        {loading ? "Calcul..." : "Calculer le prix"}
      </button>

      <br /><br />

      {prix !== null && <h2>Prix : {prix} €</h2>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;

