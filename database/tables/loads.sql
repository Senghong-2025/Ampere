CREATE TABLE IF NOT EXISTS loads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  home_id INTEGER NOT NULL,
  room_number INTEGER NOT NULL,
  current_kw DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_on TEXT NOT NULL,
  modified_on TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS loads_home_created_idx
ON loads (home_id, created_on);

CREATE INDEX IF NOT EXISTS loads_home_room_created_idx
ON loads (home_id, room_number, created_on);
