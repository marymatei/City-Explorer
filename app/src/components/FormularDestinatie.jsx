// Formularul de adaugare a unei destinatii, cu validare
import { useState } from 'react'

// Verifica valorile si intoarce un obiect cu mesajele de eroare (gol = totul e corect)
function valideaza(valori) {
  const erori = {}

  // Orasul: cel putin doua caractere, fara spatiile de la capete
  if (valori.oras.trim().length < 2) {
    erori.oras = 'Orasul are cel putin doua caractere.'
  }

  // Tara: obligatorie
  if (valori.tara.trim() === '') {
    erori.tara = 'Tara este obligatorie.'
  }

  // Zilele: un numar intre 1 si 30
  const zile = Number(valori.zile)
  if (valori.zile === '' || Number.isNaN(zile) || zile < 1 || zile > 30) {
    erori.zile = 'Numarul de zile este intre 1 si 30.'
  }

  return erori
}

export default function FormularDestinatie({ onAdd, seTrimite }) {
  // Toate cele trei campuri stau intr-un singur obiect
  const [valori, setValori] = useState({ oras: '', tara: '', zile: '' })
  const [erori, setErori] = useState({}) // mesajele de eroare afisate sub campuri

  // Un singur onChange pentru toate campurile, dupa atributul name
  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  // La trimitere: valideaza, si doar daca e totul corect trimite datele
  async function handleSubmit(event) {
    event.preventDefault() // opreste reincarcarea paginii

    const gasite = valideaza(valori)
    setErori(gasite)

    // Daca exista erori, nu se trimite nimic
    if (Object.keys(gasite).length > 0) {
      return
    }

    await onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile), // zilele se trimit ca numar, nu ca text
      vizitat: false,
    })

    // Goleste campurile dupa adaugare
    setValori({ oras: '', tara: '', zile: '' })
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      {/* Campul pentru oras, cu mesajul lui de eroare dedesubt */}
      <div className="camp">
        <input
          name="oras"
          placeholder="Oras"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      {/* Campul pentru tara */}
      <div className="camp">
        <input
          name="tara"
          placeholder="Tara"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      {/* Campul pentru zile */}
      <div className="camp">
        <input
          name="zile"
          type="number"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      {/* Butonul e dezactivat cat timp cererea e in curs */}
      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adauga'}
      </button>
    </form>
  )
}