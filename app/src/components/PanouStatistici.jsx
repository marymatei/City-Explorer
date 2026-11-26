// Panoul de statistici: cifrele sunt calculate pe server, in SQL
import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
  const [prag, setPrag] = useState('3')     // pragul de zile din primul camp
  const [tara, setTara] = useState('')      // tara din al doilea camp (gol = toate)
  const [cifre, setCifre] = useState(null)  // raspunsul serverului
  const [eroare, setEroare] = useState(null) // mesajul de eroare, daca cererea esueaza

  // Cere cifrele de fiecare data cand se schimba pragul sau tara
  useEffect(() => {
    async function incarca() {
      try {
        const date = await getStatistici(prag, tara)
        setCifre(date)
        setEroare(null)
      } catch (err) {
        setEroare(err.message)
      }
    }

    incarca()
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>

      {/* Campul pentru prag */}
      <label>
        Cel putin{' '}
        <input
          type="number"
          value={prag}
          onChange={(event) => setPrag(event.target.value)}
        />{' '}
        zile
      </label>{' '}

      {/* Campul pentru tara */}
      <label>
        Tara{' '}
        <input
          value={tara}
          placeholder="toate"
          onChange={(event) => setTara(event.target.value)}
        />
      </label>

      {/* Mesaj de eroare, daca serverul nu raspunde */}
      {eroare && <p className="stare eroare">Statistici indisponibile: {eroare}</p>}

      {/* Mesaj de incarcare, pana sosesc primele cifre */}
      {!eroare && cifre === null && <p className="stare">Se incarca statisticile...</p>}

      {/* Cele trei cifre primite de la server */}
      {!eroare && cifre !== null && (
        <ul>
          <li>Destinatii: {cifre.destinatii}</li>
          <li>Total zile: {cifre.zile}</li>
          <li>Media: {cifre.medie} zile</li>
        </ul>
      )}
    </section>
  )
}