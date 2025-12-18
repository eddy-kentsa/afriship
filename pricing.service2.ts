export function calculPrixColis(
  poids: number,
  codePromo?: string
): number | string {
  // ton code actuel


function validerCommande(poids: number, codePromo?: string): string | null {

    if (poids <= 0) {
        return "Erreur : poids invalide - Saisissez un nombre positif et non nul";
    }

    if (poids > 20) {
        return "Poids maximum dépassé - Saisissez un poids de moins de 20kg";
    }
    
     if (codePromo && codePromo !== "AFRI10") {
        return "Code promo invalide";
    }

    return null ;
}

function getPrixParKg(poids: number): number {

let prixParKg: number;
 if (poids <= 5) {
   prixParKg = 1;
 } else {
   prixParKg = 1.5;
}
return prixParKg ;
}

const erreur = validerCommande(poids, codePromo);

if (erreur) {
    return erreur; // On affiche le message d'erreur sur la commande invalide
  }

let prixTotal: number = poids * getPrixParKg(poids);
const reduction = 0.9;

 if (codePromo === "AFRI10" && poids>=5) {
   prixTotal *= reduction;
 }

 if (prixTotal < 3) {
  prixTotal = 3;                       //Prix minimum 3 euros même si le calcul donne moins.
}

 return prixTotal;

  
}
