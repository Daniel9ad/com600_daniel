INSERT INTO users (
  id,
  email,
  password,
  creation_user,
  update_user,
  creation_time,
  update_time,
  status
) VALUES (
  gen_random_uuid(),
  'usuario@ejemplo.com',
  '$2b$10$93IuF9vCfwq7RKIwJrvY5ObmIxygF2e4E4GgY/nqGn2vI5vLwVO/a',
  'admin',
  'admin',
  now(),
  now(),
  1
);