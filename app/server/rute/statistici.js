// Ruta panoului de statistici (data gata scrisa in ghid, anexa A)
import { Router } from 'express'
import { pool } from '../db.js'

// Router = un grup de rute tinut intr-un fisier separat
const router = Router()

// GET /api/statistici?prag=3&tara=... (calea '/' se adauga dupa /api/statistici)
router.get('/', async (req, res) => {
  const prag = Number(req.query.prag)   // pragul din adresa, transformat in numar
  const tara = req.query.tara ?? ''     // tara din adresa, sau sir gol daca lipseste

  // Pragul trebuie sa fie un intreg pozitiv, altfel 400
  if (!Number.isInteger(prag) || prag < 1) {
    return res.status(400).json({ eroare: 'Pragul trebuie sa fie un intreg pozitiv.' })
  }

  // Numara destinatiile si aduna zilele direct in SQL
  let sql = `SELECT COUNT(*) AS destinatii, COALESCE(SUM(zile), 0) AS zile
               FROM destinatii
              WHERE zile >= ?`
  const valori = [prag]

  // Filtrul pe tara se adauga doar daca s-a cerut o tara
  if (tara !== '') {
    sql += ' AND tara = ?'
    valori.push(tara)
  }

  const [randuri] = await pool.query(sql, valori)

  // SUM vine ca text, deci se transforma in numar
  const destinatii = Number(randuri[0].destinatii)
  const zile = Number(randuri[0].zile)

  res.json({
    destinatii,
    zile,
    medie: destinatii === 0 ? 0 : Number((zile / destinatii).toFixed(1)), // media, cu o zecimala
  })
})

export default router