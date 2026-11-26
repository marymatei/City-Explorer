// Adauga 200 000 de destinatii in baza de date, pentru exercitiul 5.
// Se ruleaza o singura data: node --env-file=.env genereaza.js
import { pool } from './db.js'

// Numele de orase si tari din care se compun destinatiile generate
const ORASE = ['Alba', 'Arad', 'Bacau', 'Baia', 'Bistrita', 'Botosani', 'Brad', 'Buzau',
  'Calafat', 'Caracal', 'Codlea', 'Comanesti', 'Deva', 'Dorohoi', 'Fagaras', 'Galati',
  'Giurgiu', 'Husi', 'Iasi', 'Lugoj', 'Medias', 'Moinesti', 'Onesti', 'Oradea',
  'Pascani', 'Petrosani', 'Pitesti', 'Reghin', 'Roman', 'Sebes', 'Sibiu', 'Slatina',
  'Tecuci', 'Turda', 'Vaslui', 'Zalau']
const TARI = ['Romania', 'Bulgaria', 'Ungaria', 'Serbia', 'Polonia', 'Cehia']

const TOTAL = 200000   // cate randuri se adauga in total
const PACHET = 5000    // cate randuri se trimit la o singura interogare

const t0 = Date.now()  // momentul de start, pentru durata totala

for (let start = 0; start < TOTAL; start += PACHET) {
  const valori = []

  // Construieste un pachet de randuri: oras-numar, tara, zile, vizitat
  for (let i = start; i < start + PACHET; i += 1) {
    valori.push([
      `${ORASE[i % ORASE.length]}-${i}`,
      TARI[i % TARI.length],
      (i % 14) + 1,
      i % 3 === 0,
    ])
  }

  // Un singur INSERT pentru tot pachetul
  await pool.query('INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES ?', [valori])
  process.stdout.write(`\r${start + PACHET} / ${TOTAL}`) // progresul, pe aceeasi linie
}

// Numara randurile din tabela la final
const [randuri] = await pool.query('SELECT COUNT(*) AS total FROM destinatii')
console.log(`\nGata in ${((Date.now() - t0) / 1000).toFixed(1)} s. Tabela are ${randuri[0].total} randuri.`)

// Inchide conexiunile, ca scriptul sa se termine
await pool.end()