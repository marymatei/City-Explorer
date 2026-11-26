// Grila de carduri cu destinatii
import DestinatieCard from './DestinatieCard.jsx'

export default function ListaDestinatii({ destinatii, onToggle, onDelete }) {
  // Daca lista e goala, afiseaza un mesaj in locul grilei
  if (!destinatii || destinatii.length === 0) {
    return <p className="info">Nu exista nicio destinatie.</p>
  }

  return (
    <div className="lista">
      {/* Cate un card pentru fiecare destinatie */}
      {destinatii.map((destinatie) => (
        <DestinatieCard
          key={destinatie.id}
          destinatie={destinatie}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}