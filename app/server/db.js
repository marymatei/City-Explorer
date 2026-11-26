// Conexiunea la baza de date MariaDB
import mysql from 'mysql2/promise'

// Pool = un set de conexiuni deschise o singura data si refolosite de toate cererile.
// Valorile vin din fisierul .env, prin process.env.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,           // adresa serverului de baze de date
  port: Number(process.env.DB_PORT),   // portul, transformat din text in numar
  user: process.env.DB_USER,           // utilizatorul
  password: process.env.DB_PASSWORD,   // parola
  database: process.env.DB_NAME,       // numele bazei
  connectionLimit: 10,                 // cel mult 10 conexiuni deschise deodata
})