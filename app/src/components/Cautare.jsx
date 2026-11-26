// Campul de cautare dupa oras sau tara
export default function Cautare({ valoare, onChange }) {
  return (
    <div className="cautare">
      {/* Camp controlat: valoarea vine din App, iar schimbarea se trimite inapoi in App */}
      <input
        type="search"
        placeholder="Cauta dupa oras sau tara"
        value={valoare}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}