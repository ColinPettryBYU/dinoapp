CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS username VARCHAR(100);

UPDATE users
SET username = LOWER(REGEXP_REPLACE(first_name || last_name, '\s+', '', 'g'))
WHERE username IS NULL OR username = '';
