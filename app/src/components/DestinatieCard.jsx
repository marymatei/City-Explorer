// Cardul unei destinatii, cu butonul de vizitat si butonul Sterge
export default function DestinatieCard({ destinatie, onToggle, onDelete }) {
  const { oras, tara, zile, vizitat } = destinatie

  return (
    // Cardul vizitat primeste in plus clasa vizitat (fundal verde)
    <article className={vizitat ? 'card vizitat' : 'card'}>
      <h3>{oras}</h3>
      <p className="tara">{tara}</p>
      <p className="zile">{zile} zile</p>

      {/* Butonul care schimba starea vizitat */}
      <button type="button" onClick={() => onToggle(destinatie.id)}>
        {vizitat ? 'Vizitat' : 'Marcheaza vizitat'}
      </button>

      {/* Butonul rosu Sterge, afisat doar daca s-a primit functia onDelete */}
      {onDelete && (
        <button
          type="button"
          style={{ marginTop: '0.4rem', background: '#dc2626' }}
          onClick={() => onDelete(destinatie.id)}
        >
          Sterge
        </button>
      )}
    </article>
  )
}