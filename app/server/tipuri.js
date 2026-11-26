// Afiseaza ce tip are in JavaScript fiecare valoare intoarsa de MariaDB.
// Se ruleaza o singura data: node --env-file=.env tipuri.js
import { pool } from './db.js'

// Un rand obisnuit din tabela
const [randuri] = await pool.query(
  'SELECT id, oras, zile, vizitat FROM destinatii WHERE id = 1',
)

// Trei functii de agregare
const [agregate] = await pool.query(
  'SELECT COUNT(*) AS cate, SUM(zile) AS total, AVG(zile) AS medie FROM destinatii',
)

// Scrie pe cate o linie: numele campului, valoarea si tipul ei
const arata = (obiect) => {
  for (const [cheie, valoare] of Object.entries(obiect)) {
    console.log(cheie.padEnd(8), JSON.stringify(valoare).padEnd(14), typeof valoare)
  }
}

console.log('--- un rand din tabela')
arata(randuri[0])
console.log('--- functii de agregare')
arata(agregate[0])

// Inchide conexiunile, ca scriptul sa se termine
await pool.end()