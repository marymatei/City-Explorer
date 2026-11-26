// Exemplul din laboratorul 4: lista de orase adusa de la server
import { useEffect, useState } from 'react'
import { getOrase } from '../api/orase.js'

export default function ListaOrase() {
  const [orase, setOrase] = useState([])          // lista de orase
  const [incarcare, setIncarcare] = useState(true) // true cat timp se asteapta
  const [eroare, setEroare] = useState(null)       // mesajul de eroare

  // Aduce orasele o singura data, la pornire
  useEffect(() => {
    async function incarca() {
      try {
        const date = await getOrase()
        setOrase(date)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [])

  if (incarcare) return <p>Se incarca...</p>
  if (eroare) return <p>A aparut o eroare: {eroare}</p>

  return (
    <ul>
      {orase.map((o) => (
        <li key={o.id}>{o.oras}, {o.tara} - {o.pret} euro</li>
      ))}
    </ul>
  )
}