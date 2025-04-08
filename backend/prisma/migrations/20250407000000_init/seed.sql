-- Create custom admin user
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'custom-admin-id',
  'Custom Admin',
  'm@mvt.art',
  '$2b$10$XFhBGQvGwVrpFSmrjEjSZeQCYVlEQHxFfZQK5Y7QJvSKZEF9O9VJi', -- Hashed password for 'Wikkie=555'
  'ADMIN',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE
SET password = '$2b$10$XFhBGQvGwVrpFSmrjEjSZeQCYVlEQHxFfZQK5Y7QJvSKZEF9O9VJi',
    name = 'Custom Admin',
    role = 'ADMIN',
    "updatedAt" = CURRENT_TIMESTAMP;
