// Raportul jurnalului: GET /api/jurnal/raport (exercitiul 4b)
// Varianta corectata: filtrul foloseste semnul ? (interogare cu parametri)
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Calea '/raport' se adauga dupa /api/jurnal
router.get('/raport', async (req, res) => {
  const metoda = req.query.metoda ?? '' // filtrul optional ?metoda=GET

  // Cele mai cerute adrese: metoda, calea, numarul de cereri si durata medie
  let sql = 'SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms FROM jurnal'

  const valori = [] // valorile trimise separat, in locul semnelor ?

  // CORECT: in text se scrie ?, iar valoarea se trimite separat
  if (metoda !== '') {
    sql += ' WHERE metoda = ?'
    valori.push(metoda)
  }

  // Grupare, ordonare descrescatoare dupa numarul de cereri, cel mult 10 randuri
  sql += ' GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10'

  const [randuri] = await pool.query(sql, valori)

  // AVG (si COUNT) se transforma in numar inainte de trimitere
  res.json(randuri.map((r) => ({ ...r, cereri: Number(r.cereri), medie_ms: Number(r.medie_ms) })))
})

export default router