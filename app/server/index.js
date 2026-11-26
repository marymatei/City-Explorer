// Serverul Express al aplicatiei City Explorer
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import statistici from './rute/statistici.js'
import { jurnal } from './jurnal.js'
import jurnalRute from './rute/jurnal.js'

// Creeaza aplicatia Express
const app = express()

// Middleware de depanare: scrie in terminal fiecare cerere primita (metoda si adresa)
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next() // da drumul cererii mai departe
})

// Jurnalul e pus INAINTEA lui cors(), ca sa vada si cererile OPTIONS (exercitiul 4d)
app.use(jurnal)

// Permite paginii de pe portul 5173 sa foloseasca raspunsurile (CORS)
app.use(cors())
// Citeste corpul JSON al cererilor POST si PATCH si il pune in req.body
app.use(express.json())

// GET /api/destinatii - intoarce toate destinatiile, ordonate dupa id
app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id',
  )

  // Conversii: id devine text, vizitat devine true/false (MariaDB da 0 sau 1)
  res.json(randuri.map((d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })))
})

// GET /api/destinatii/caut?oras=... - destinatiile cu orasul exact cel cerut (exercitiul 5)
app.get('/api/destinatii/caut', async (req, res) => {
  const oras = req.query.oras ?? '' // valoarea din adresa, sau sir gol daca lipseste

  // Valoarea se trimite separat, in locul semnului ?, nu lipita in text
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [oras],
  )

  res.json(randuri.map((d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })))
})

// POST /api/destinatii - adauga o destinatie noua (exercitiul 2)
app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body // datele trimise de client

  // Validarea pe server: oras si tara obligatorii, zile intreg intre 1 si 30
  if (
    typeof oras !== 'string' || oras.trim() === '' ||
    typeof tara !== 'string' || tara.trim() === '' ||
    !Number.isInteger(zile) || zile < 1 || zile > 30
  ) {
    // return opreste ruta aici, ca sa nu se raspunda de doua ori
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  // Inserarea, cu patru semne de intrebare; destinatia noua porneste nevizitata
  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras, tara, zile, false],
  )

  // 201 = creat; obiectul complet, cu id-ul generat de baza (insertId)
  res.status(201).json({ id: String(rezultat.insertId), oras, tara, zile, vizitat: false })
})

// PATCH /api/destinatii/:id - schimba doar campul vizitat (exercitiul 3)
app.patch('/api/destinatii/:id', async (req, res) => {
  const id = Number(req.params.id)            // id-ul din adresa, transformat in numar
  const vizitat = Boolean(req.body.vizitat)   // noua valoare, din corpul cererii

  const [rezultat] = await pool.query(
    'UPDATE destinatii SET vizitat = ? WHERE id = ?',
    [vizitat, id],
  )

  // Niciun rand atins = destinatia nu exista, deci 404
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinatia nu exista.' })
  }

  // Citeste randul actualizat si il trimite inapoi, cu aceleasi conversii
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
    [id],
  )

  const d = randuri[0]
  res.json({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })
})

// In plus fata de ghid: DELETE /api/destinatii/:id, folosita de butonul rosu Sterge
app.delete('/api/destinatii/:id', async (req, res) => {
  const [rezultat] = await pool.query(
    'DELETE FROM destinatii WHERE id = ?',
    [Number(req.params.id)],
  )

  // Niciun rand sters = destinatia nu exista, deci 404
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinatia nu exista.' })
  }

  res.status(204).end() // 204 = sters, fara continut in raspuns
})

// Ruta de ecou (temporara, pentru fisa, punctul 1): intoarce tot ce a primit
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body })
})

// Rutele panoului de statistici, din fisierul rute/statistici.js
app.use('/api/statistici', statistici)

// Rutele raportului, din fisierul rute/jurnal.js
app.use('/api/jurnal', jurnalRute)

// Porneste serverul pe portul din .env (3000)
app.listen(process.env.PORT, () => {
  console.log(`API pornit pe http://localhost:${process.env.PORT}`)
})