# Railway.com Deployment Configuration

This file contains the configuration for deploying the Kunstcollectie application to Railway.com.

## Frontend Configuration

```json
{
  "name": "kunstcollectie-frontend",
  "buildCommand": "npm run build",
  "startCommand": "npm run start",
  "healthcheckPath": "/",
  "healthcheckTimeout": 10,
  "restartPolicyType": "on-failure",
  "restartPolicyMaxRetries": 5,
  "env": {
    "NODE_ENV": "production",
    "VITE_API_URL": "${RAILWAY_STATIC_URL}/api"
  }
}
```

## Backend Configuration

```json
{
  "name": "kunstcollectie-backend",
  "buildCommand": "npm run build",
  "startCommand": "npm run start",
  "healthcheckPath": "/api/health",
  "healthcheckTimeout": 10,
  "restartPolicyType": "on-failure",
  "restartPolicyMaxRetries": 5,
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "${DATABASE_URL}",
    "JWT_SECRET": "${JWT_SECRET}",
    "FRONTEND_URL": "${RAILWAY_STATIC_URL}"
  }
}
```

## Database Configuration

```json
{
  "name": "kunstcollectie-database",
  "image": "postgres:14",
  "env": {
    "POSTGRES_USER": "kunstcollectie",
    "POSTGRES_PASSWORD": "${DB_PASSWORD}",
    "POSTGRES_DB": "kunstcollectie"
  },
  "volumes": [
    {
      "name": "kunstcollectie-data",
      "mountPath": "/var/lib/postgresql/data"
    }
  ]
}
```

## Environment Variables

The following environment variables need to be set in the Railway.com project:

- `JWT_SECRET`: Secret key for JWT token generation
- `DB_PASSWORD`: Password for the PostgreSQL database
- `SENDGRID_API_KEY`: API key for SendGrid email service
