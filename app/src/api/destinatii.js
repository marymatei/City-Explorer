// Functiile prin care interfata vorbeste cu serverul, pentru destinatii
// Adresa serverului (la exercitiul 3b se schimba in 'http://localhost:3000/api')
const API_URL = 'http://localhost:3000/api'

// Aduce lista completa de destinatii (GET)
export async function getDestinatii() {
  const response = await fetch(`${API_URL}/destinatii`)

  // Daca serverul raspunde cu eroare, oprim si aruncam un mesaj cu codul de stare
  if (!response.ok) {
    throw new Error(`Serverul a raspuns cu ${response.status}`)
  }

  return response.json() // transforma raspunsul din JSON in tablou
}

// Trimite o destinatie noua (POST) si intoarce obiectul salvat, cu id
export async function postDestinatie(destinatie) {
  const response = await fetch(`${API_URL}/destinatii`, {
    method: 'POST',                                      // metoda cererii
    headers: { 'Content-Type': 'application/json' },     // spune serverului ca trimitem JSON
    body: JSON.stringify(destinatie),                    // obiectul, transformat in text
  })

  if (!response.ok) {
    throw new Error(`Serverul a raspuns cu ${response.status}`)
  }

  return response.json()
}

// Schimba doar campul vizitat al unei destinatii (PATCH)
export async function patchVizitat(id, vizitat) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vizitat }),                   // corpul contine un singur camp
  })

  if (!response.ok) {
    throw new Error(`Serverul a raspuns cu ${response.status}`)
  }

  return response.json()
}

// In plus fata de anexa: sterge o destinatie (DELETE), pentru butonul Sterge
export async function deleteDestinatie(id) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Serverul a raspuns cu ${response.status}`)
  }
}