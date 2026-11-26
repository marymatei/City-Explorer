// Componenta principala a aplicatiei City Explorer
import { useEffect, useState } from 'react'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import { getDestinatii, postDestinatie, patchVizitat, deleteDestinatie } from './api/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Rezumat from './components/Rezumat.jsx'
import Cautare from './components/Cautare.jsx'
import PanouStatistici from './components/PanouStatistici.jsx'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])   // lista adusa de la server
  const [incarcare, setIncarcare] = useState(true)   // true cat timp se asteapta raspunsul
  const [eroare, setEroare] = useState(null)         // mesajul de eroare, daca exista
  const [seTrimite, setSeTrimite] = useState(false)  // true cat timp se trimite formularul
  const [cautare, setCautare] = useState('')         // textul din campul de cautare

  // La pornire, aduce destinatiile de la server (o singura data, lista de dependente goala)
  useEffect(() => {
    async function incarca() {
      try {
        const lista = await getDestinatii()
        setDestinatii(lista)
      } catch (err) {
        setEroare(err.message)
      } finally {
        setIncarcare(false) // se opreste indicatorul si la reusita, si la eroare
      }
    }

    incarca()
  }, [])

  // Marcheaza o destinatie ca vizitata / nevizitata, pe server
  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)

    try {
      const salvata = await patchVizitat(id, !destinatie.vizitat)
      // Inlocuieste in stare destinatia veche cu cea intoarsa de server
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (err) {
      setEroare(err.message)
    }
  }

  // Adauga o destinatie noua, pe server
  async function handleAdd(destinatie) {
    setSeTrimite(true)

    try {
      const salvata = await postDestinatie(destinatie)
      // In stare se pune obiectul intors de server (are id)
      setDestinatii((curent) => [...curent, salvata])
    } catch (err) {
      setEroare(err.message)
    } finally {
      setSeTrimite(false)
    }
  }

  // Sterge o destinatie, pe server (butonul Sterge)
  async function handleDelete(id) {
    try {
      await deleteDestinatie(id)
      setDestinatii((curent) => curent.filter((d) => d.id !== id))
    } catch (err) {
      setEroare(err.message)
    }
  }

  const nevizitate = getNevizitate(destinatii)

  // Filtrarea dupa textul cautat, in browser (fara cereri catre server)
  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(text) || d.tara.toLowerCase().includes(text),
  )

  return (
    <main>
      <h1>City Explorer</h1>

      {/* Mesajul cat timp se incarca */}
      {incarcare && <p className="stare">Se incarca destinatiile...</p>}

      {/* Mesajul de eroare, daca cererea a esuat */}
      {!incarcare && eroare && (
        <p className="stare eroare">Nu am putut incarca datele: {eroare}</p>
      )}

      {/* Aplicatia propriu-zisa, dupa ce au sosit datele */}
      {!incarcare && !eroare && (
        <>
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={totalZile(nevizitate)}
          />
          <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
          <Cautare valoare={cautare} onChange={setCautare} />
          <PanouStatistici />

          {/* Nicio destinatie in aplicatie */}
          {destinatii.length === 0 && (
            <p className="gol">Nu exista nicio destinatie. Adauga prima din formular.</p>
          )}

          {/* Exista destinatii, dar cautarea nu gaseste nimic */}
          {destinatii.length > 0 && afisate.length === 0 && (
            <p className="gol">Niciun rezultat pentru "{cautare}".</p>
          )}

          {/* Lista de carduri */}
          {afisate.length > 0 && (
            <ListaDestinatii destinatii={afisate} onToggle={handleToggle} onDelete={handleDelete} />
          )}
        </>
      )}
    </main>
  )
}