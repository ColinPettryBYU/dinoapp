INSERT INTO users (first_name, last_name, email, role, username)
VALUES
  ('Ava', 'Stone', 'ava.stone@dinocamp.com', 'director', 'avastone'),
  ('Milo', 'Rivera', 'milo.rivera@dinocamp.com', 'counselor', 'milorivera'),
  ('Nora', 'Lee', 'nora.lee@dinocamp.com', 'counselor', 'noralee'),
  ('Theo', 'Kim', 'theo.kim@dinocamp.com', 'admin', 'theokim')
ON CONFLICT (email)
DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  username = EXCLUDED.username;
