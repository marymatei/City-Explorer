-- Structura si datele initiale ale bazei city_explorer.
-- Containerul il ruleaza singur, la prima pornire.
-- Se poate rula oricand din DataGrip: sterge tabelele si le creeaza la loc.

-- Cere clientului sa trimita textul in codificarea corecta (pentru diacritice)
SET NAMES utf8mb4;

-- Tabela folosita de exemplele din ghid
DROP TABLE IF EXISTS orase;

CREATE TABLE orase (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- identificator generat automat
  oras VARCHAR(100) NOT NULL,         -- numele orasului
  tara VARCHAR(100) NOT NULL,         -- tara
  pret INT NOT NULL                   -- pretul, in euro
);

INSERT INTO orase (oras, tara, pret) VALUES
  ('Madrid',    'Spania',  520),
  ('Barcelona', 'Spania',  480),
  ('Praga',     'Cehia',   310),
  ('Viena',     'Austria', 390);

-- Tabela aplicatiei: destinatiile din City Explorer
DROP TABLE IF EXISTS destinatii;

CREATE TABLE destinatii (
  id INT AUTO_INCREMENT PRIMARY KEY,         -- identificator generat automat
  oras VARCHAR(100) NOT NULL,                -- numele orasului
  tara VARCHAR(100) NOT NULL,                -- tara
  zile INT NOT NULL,                         -- cate zile dureaza vizita
  vizitat BOOLEAN NOT NULL DEFAULT FALSE     -- daca a fost vizitata (0 sau 1)
);

-- Cele sase destinatii de pornire
INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES
  ('Lisabona',    'Portugalia', 4, FALSE),
  ('Cluj-Napoca', 'România',    2, TRUE),
  ('Porto',       'Portugalia', 3, FALSE),
  ('Brașov',      'România',    2, TRUE),
  ('Kyoto',       'Japonia',    6, FALSE),
  ('Tokyo',       'Japonia',    5, FALSE);

-- Tabela jurnalului de cereri (exercitiul 4)
DROP TABLE IF EXISTS jurnal;

CREATE TABLE jurnal (
  id INT AUTO_INCREMENT PRIMARY KEY,                    -- identificator generat automat
  metoda VARCHAR(10) NOT NULL,                          -- GET, POST, PATCH, OPTIONS...
  cale VARCHAR(255) NOT NULL,                           -- adresa ceruta, de ex. /api/destinatii
  status INT NOT NULL,                                  -- codul de stare al raspunsului
  durata_ms INT NOT NULL,                               -- cat a durat cererea, in milisecunde
  creat_la DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  -- cand a fost scris randul
);