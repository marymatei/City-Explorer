// Exemplul din laboratorul 4: formular cu un singur camp, pentru buget
import { useState } from 'react'

export default function FormularBuget({ onCauta }) {
  const [buget, setBuget] = useState('')  // valoarea din camp (text)
  const [eroare, setEroare] = useState('') // mesajul de eroare

  function handleSubmit(event) {
    event.preventDefault() // opreste reincarcarea paginii

    const numar = Number(buget) // transforma textul in numar

    // Bugetul trebuie sa fie un numar de cel putin 50
    if (buget === '' || Number.isNaN(numar) || numar < 50) {
      setEroare('Bugetul este un numar de cel putin 50 de euro.')
      return
    }

    setEroare('')
    onCauta(numar)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        type="number"
        placeholder="Buget maxim"
        value={buget}
        onChange={(event) => setBuget(event.target.value)}
      />
      <button type="submit">Cauta</button>
      {eroare && <p className="eroare-camp">{eroare}</p>}
    </form>
  )
}