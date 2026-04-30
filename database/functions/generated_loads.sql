CREATE OR REPLACE FUNCTION app_create_generated_load(
  p_date TEXT,
  p_home_id INTEGER,
  p_total_usage DOUBLE PRECISION,
  p_saving_amount DOUBLE PRECISION,
  p_total_usage_amount DOUBLE PRECISION,
  p_extra_amount_each_room DOUBLE PRECISION,
  p_bank_transfer DOUBLE PRECISION,
  p_data JSONB
)
RETURNS TABLE (
  id TEXT,
  date TEXT,
  home_id INTEGER,
  total_usage DOUBLE PRECISION,
  saving_amount DOUBLE PRECISION,
  total_usage_amount DOUBLE PRECISION,
  extra_amount_each_room DOUBLE PRECISION,
  bank_transfer DOUBLE PRECISION,
  data JSONB
)
LANGUAGE sql
AS $$
  INSERT INTO generated_loads (
    date,
    home_id,
    total_usage,
    saving_amount,
    total_usage_amount,
    extra_amount_each_room,
    bank_transfer,
    data
  )
  VALUES (
    p_date,
    p_home_id,
    p_total_usage,
    p_saving_amount,
    p_total_usage_amount,
    p_extra_amount_each_room,
    p_bank_transfer,
    COALESCE(p_data, '[]'::jsonb)
  )
  RETURNING
    generated_loads.id::text,
    generated_loads.date,
    generated_loads.home_id,
    generated_loads.total_usage,
    generated_loads.saving_amount,
    generated_loads.total_usage_amount,
    generated_loads.extra_amount_each_room,
    generated_loads.bank_transfer,
    generated_loads.data;
$$;

CREATE OR REPLACE FUNCTION app_get_generated_loads(
  p_home_id INTEGER,
  p_start_date TEXT,
  p_end_date TEXT,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id TEXT,
  date TEXT,
  home_id INTEGER,
  total_usage DOUBLE PRECISION,
  saving_amount DOUBLE PRECISION,
  total_usage_amount DOUBLE PRECISION,
  extra_amount_each_room DOUBLE PRECISION,
  bank_transfer DOUBLE PRECISION,
  data JSONB
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    generated_loads.id::text,
    generated_loads.date,
    generated_loads.home_id,
    generated_loads.total_usage,
    generated_loads.saving_amount,
    generated_loads.total_usage_amount,
    generated_loads.extra_amount_each_room,
    generated_loads.bank_transfer,
    generated_loads.data
  FROM generated_loads
  WHERE generated_loads.home_id = p_home_id
    AND generated_loads.date >= p_start_date
    AND generated_loads.date <= p_end_date
  ORDER BY generated_loads.date DESC
  LIMIT LEAST(p_limit, 100);
$$;

CREATE OR REPLACE FUNCTION app_update_generated_load(
  p_id BIGINT,
  p_date TEXT,
  p_home_id INTEGER,
  p_total_usage DOUBLE PRECISION,
  p_saving_amount DOUBLE PRECISION,
  p_total_usage_amount DOUBLE PRECISION,
  p_extra_amount_each_room DOUBLE PRECISION,
  p_bank_transfer DOUBLE PRECISION,
  p_data JSONB
)
RETURNS TABLE (
  id TEXT,
  date TEXT,
  home_id INTEGER,
  total_usage DOUBLE PRECISION,
  saving_amount DOUBLE PRECISION,
  total_usage_amount DOUBLE PRECISION,
  extra_amount_each_room DOUBLE PRECISION,
  bank_transfer DOUBLE PRECISION,
  data JSONB
)
LANGUAGE sql
AS $$
  UPDATE generated_loads
  SET
    date = p_date,
    home_id = p_home_id,
    total_usage = p_total_usage,
    saving_amount = p_saving_amount,
    total_usage_amount = p_total_usage_amount,
    extra_amount_each_room = p_extra_amount_each_room,
    bank_transfer = p_bank_transfer,
    data = COALESCE(p_data, '[]'::jsonb)
  WHERE generated_loads.id = p_id
  RETURNING
    generated_loads.id::text,
    generated_loads.date,
    generated_loads.home_id,
    generated_loads.total_usage,
    generated_loads.saving_amount,
    generated_loads.total_usage_amount,
    generated_loads.extra_amount_each_room,
    generated_loads.bank_transfer,
    generated_loads.data;
$$;

CREATE OR REPLACE FUNCTION app_delete_generated_load(p_id BIGINT)
RETURNS TABLE (id TEXT)
LANGUAGE sql
AS $$
  DELETE FROM generated_loads
  WHERE generated_loads.id = p_id
  RETURNING generated_loads.id::text;
$$;
