// Functia care cere cifrele panoului de statistici de la server (anexa A)
const API_URL = 'http://localhost:3000/api'

export async function getStatistici(prag, tara) {
  // Construieste adresa: /api/statistici?prag=...&tara=...
  const adresa = new URL(`${API_URL}/statistici`)
  adresa.searchParams.set('prag', prag)

  // Tara se adauga doar daca a fost scrisa ceva in camp
  if (tara !== '') {
    adresa.searchParams.set('tara', tara)
  }

  const response = await fetch(adresa)

  // Daca serverul raspunde cu eroare, oprim si aruncam un mesaj cu codul de stare
  if (!response.ok) {
    throw new Error(`Serverul a raspuns cu ${response.status}`)
  }

  return response.json() // { destinatii, zile, medie }
}