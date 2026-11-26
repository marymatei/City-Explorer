// Middleware-ul care scrie fiecare cerere in tabela jurnal (exercitiul 4a)
import { pool } from './db.js'

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint() // momentul in care a intrat cererea
  const cale = req.originalUrl            // calea se retine ACUM, inainte de next()

  // 'finish' = raspunsul a plecat; abia acum se stiu codul de stare si durata
  res.on('finish', async () => {
    const durata = Number(process.hrtime.bigint() - inceput) / 1e6 // nanosecunde -> milisecunde

    // try/catch: o eroare aici nu mai poate deveni raspuns, deci se prinde
    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [req.method, cale, res.statusCode, Math.round(durata)],
      )
    } catch (err) {
      console.error('Jurnalul nu a putut fi scris:', err.message)
    }
  })

  next() // da drumul cererii mai departe
}
