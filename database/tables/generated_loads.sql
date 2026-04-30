CREATE TABLE IF NOT EXISTS generated_loads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date TEXT NOT NULL,
  home_id INTEGER NOT NULL,
  total_usage DOUBLE PRECISION NOT NULL DEFAULT 0,
  saving_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_usage_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  extra_amount_each_room DOUBLE PRECISION NOT NULL DEFAULT 0,
  bank_transfer DOUBLE PRECISION NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS generated_loads_home_date_idx
ON generated_loads (home_id, date);
