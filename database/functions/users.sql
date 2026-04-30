CREATE OR REPLACE FUNCTION app_register_user(
  p_email TEXT,
  p_name TEXT,
  p_password_hash TEXT,
  p_created_at TEXT,
  p_updated_at TEXT,
  p_role TEXT DEFAULT 'user'
)
RETURNS TABLE (
  id TEXT,
  email TEXT,
  name TEXT,
  role TEXT,
  created_at TEXT,
  updated_at TEXT
)
LANGUAGE sql
AS $$
  INSERT INTO users (email, name, password_hash, created_at, updated_at, role)
  VALUES (
    LOWER(TRIM(p_email)),
    TRIM(p_name),
    p_password_hash,
    p_created_at,
    p_updated_at,
    COALESCE(p_role, 'user')
  )
  RETURNING
    users.id::text,
    users.email,
    users.name,
    users.role,
    users.created_at,
    users.updated_at;
$$;
