-- Images clients add to their Inspo board from the hub.
CREATE TABLE IF NOT EXISTS inspo (
  id      TEXT PRIMARY KEY,
  client  TEXT NOT NULL,
  board   TEXT NOT NULL DEFAULT 'inspo',   -- 'inspo' or 'photos'
  created INTEGER NOT NULL,
  note    TEXT,
  mime    TEXT NOT NULL,
  w       INTEGER,
  h       INTEGER,
  data    BLOB NOT NULL
);
CREATE INDEX IF NOT EXISTS inspo_client ON inspo (client, created);
CREATE INDEX IF NOT EXISTS inspo_board ON inspo (client, board, created);
-- Existing databases: ALTER TABLE inspo ADD COLUMN board TEXT NOT NULL DEFAULT 'inspo';

-- Videos clients upload to their Photo Library. The file itself lives in R2 (binding MEDIA) under `key`.
CREATE TABLE IF NOT EXISTS media (
  id      TEXT PRIMARY KEY,
  client  TEXT NOT NULL,
  board   TEXT NOT NULL DEFAULT 'videos',
  created INTEGER NOT NULL,
  note    TEXT,
  name    TEXT,
  mime    TEXT NOT NULL,
  size    INTEGER NOT NULL,
  key     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS media_client ON media (client, board, created);
