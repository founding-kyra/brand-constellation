-- Images clients add to their Inspo board from the hub.
CREATE TABLE IF NOT EXISTS inspo (
  id      TEXT PRIMARY KEY,
  client  TEXT NOT NULL,
  created INTEGER NOT NULL,
  note    TEXT,
  mime    TEXT NOT NULL,
  w       INTEGER,
  h       INTEGER,
  data    BLOB NOT NULL
);
CREATE INDEX IF NOT EXISTS inspo_client ON inspo (client, created);
