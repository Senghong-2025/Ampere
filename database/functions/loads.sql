CREATE OR REPLACE FUNCTION app_create_load(
  p_home_id INTEGER,
  p_room_number INTEGER,
  p_current_kw DOUBLE PRECISION,
  p_created_on TEXT,
  p_modified_on TEXT
)
RETURNS TABLE (
  id TEXT,
  home_id INTEGER,
  room_number INTEGER,
  current_kw DOUBLE PRECISION,
  created_on TEXT,
  modified_on TEXT
)
LANGUAGE sql
AS $$
  INSERT INTO loads (home_id, room_number, current_kw, created_on, modified_on)
  VALUES (p_home_id, p_room_number, p_current_kw, p_created_on, p_modified_on)
  RETURNING
    loads.id::text,
    loads.home_id,
    loads.room_number,
    loads.current_kw,
    loads.created_on,
    loads.modified_on;
$$;

CREATE OR REPLACE FUNCTION app_get_loads(
  p_home_id INTEGER,
  p_start_date TEXT,
  p_end_date TEXT,
  p_room_number INTEGER DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id TEXT,
  home_id INTEGER,
  room_number INTEGER,
  current_kw DOUBLE PRECISION,
  created_on TEXT,
  modified_on TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    loads.id::text,
    loads.home_id,
    loads.room_number,
    loads.current_kw,
    loads.created_on,
    loads.modified_on
  FROM loads
  WHERE loads.home_id = p_home_id
    AND loads.created_on >= p_start_date
    AND loads.created_on <= p_end_date
    AND (p_room_number IS NULL OR loads.room_number = p_room_number)
  ORDER BY loads.room_number ASC, loads.created_on DESC
  LIMIT LEAST(p_limit, 100);
$$;

CREATE OR REPLACE FUNCTION app_get_load_by_id(p_id BIGINT)
RETURNS TABLE (
  id TEXT,
  home_id INTEGER,
  room_number INTEGER,
  current_kw DOUBLE PRECISION,
  created_on TEXT,
  modified_on TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    loads.id::text,
    loads.home_id,
    loads.room_number,
    loads.current_kw,
    loads.created_on,
    loads.modified_on
  FROM loads
  WHERE loads.id = p_id
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION app_update_load(
  p_id BIGINT,
  p_home_id INTEGER,
  p_room_number INTEGER,
  p_current_kw DOUBLE PRECISION,
  p_created_on TEXT,
  p_modified_on TEXT
)
RETURNS TABLE (
  id TEXT,
  home_id INTEGER,
  room_number INTEGER,
  current_kw DOUBLE PRECISION,
  created_on TEXT,
  modified_on TEXT
)
LANGUAGE sql
AS $$
  UPDATE loads
  SET
    home_id = p_home_id,
    room_number = p_room_number,
    current_kw = p_current_kw,
    created_on = p_created_on,
    modified_on = p_modified_on
  WHERE loads.id = p_id
  RETURNING
    loads.id::text,
    loads.home_id,
    loads.room_number,
    loads.current_kw,
    loads.created_on,
    loads.modified_on;
$$;
