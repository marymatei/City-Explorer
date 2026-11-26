// Paragraful cu cele trei numere din capul paginii
import { nr } from '../utils/destinatii.js'

export default function Rezumat({ total, nevizitate, zile }) {
  return (
    // nr(...) pune "de" de la 20 in sus: 18 zile, dar 21 de zile
    <p className="rezumat">
      {nr(total, 'destinatii')}, {nevizitate} nevizitate, {nr(zile, 'zile')} de vizitat
    </p>
  )
}