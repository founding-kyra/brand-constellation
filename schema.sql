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
