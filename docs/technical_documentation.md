# Kunstcollectie Applicatie - Technische Documentatie

## Inhoudsopgave
1. [Inleiding](#inleiding)
2. [Architectuur](#architectuur)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Database](#database)
6. [Authenticatie](#authenticatie)
7. [API Endpoints](#api-endpoints)
8. [Deployment](#deployment)
9. [Testen](#testen)
10. [Onderhoud en Updates](#onderhoud-en-updates)

## Inleiding

De Kunstcollectie Applicatie is een webapplicatie voor het beheren van een kunstcollectie. De applicatie biedt functionaliteiten voor het beheren van kunstwerken, kunstenaars, locaties, rapportages en gebruikers. Deze technische documentatie beschrijft de architectuur, implementatie en werking van de applicatie.

## Architectuur

De applicatie is gebouwd volgens een moderne client-server architectuur met de volgende componenten:

- **Frontend**: React met Vite als build tool
- **Backend**: Next.js API routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authenticatie**: JWT (JSON Web Tokens)
- **Email Service**: SendGrid
- **Deployment**: Railway.com

De architectuur volgt het principe van "separation of concerns", waarbij de frontend, backend en database duidelijk gescheiden zijn. De communicatie tussen frontend en backend verloopt via RESTful API endpoints.

## Frontend

### Technologieën

- React 18
- Vite 4
- Material UI 5
- React Router 6
- Context API voor state management

### Mappenstructuur

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── artist/
│   │   ├── artwork/
│   │   ├── location/
│   │   ├── reports/
│   │   └── test/
│   ├── pages/
│   │   ├── artwork/
│   │   ├── artist/
│   │   └── location/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### Belangrijke Componenten

- **Layout.jsx**: Hoofdlayout met navigatie en sidebar
- **Dashboard.jsx**: Overzichtspagina met statistieken
- **Login.jsx**: Authenticatiepagina
- **ArtworkList.jsx/ArtworkDetail.jsx**: Kunstwerken beheer
- **ArtistList.jsx/ArtistDetail.jsx**: Kunstenaars beheer
- **LocationList.jsx/LocationDetail.jsx**: Locaties beheer
- **Reports.jsx**: Rapportages genereren
- **UserManagement.jsx**: Gebruikersbeheer
- **Settings.jsx**: Systeeminstellingen

### Routing

De applicatie gebruikt React Router voor navigatie. De hoofdroutes zijn:

- `/`: Dashboard
- `/login`: Inlogpagina
- `/artwork`: Kunstwerken overzicht
- `/artwork/:id`: Kunstwerk details
- `/artist`: Kunstenaars overzicht
- `/artist/:id`: Kunstenaar details
- `/location`: Locaties overzicht
- `/location/:id`: Locatie details
- `/reports`: Rapportages
- `/admin/users`: Gebruikersbeheer
- `/settings`: Instellingen

### Theming

De applicatie gebruikt het Material UI theming systeem met de volgende primaire kleuren:

- Primair: Blauw (#3f51b5)
- Secundair: Roze (#f50057)
- Accent: Groen (#4caf50)

## Backend

### Technologieën

- Next.js 14
- Prisma ORM
- JSON Web Tokens (JWT)
- SendGrid voor e-mail

### Mappenstructuur

```
backend/
├── lib/
│   ├── prisma.js
│   ├── auth.js
│   └── email.js
├── pages/
│   └── api/
│       ├── auth/
│       ├── artworks/
│       ├── artists/
│       ├── locations/
│       ├── reports/
│       ├── users/
│       └── artwork-types/
├── prisma/
│   └── schema.prisma
├── package.json
└── .env
```

### Middleware

De backend gebruikt middleware voor:

- Authenticatie en autorisatie
- CORS (Cross-Origin Resource Sharing)
- Error handling
- Logging

## Database

### Schema

De database schema is gedefinieerd in `prisma/schema.prisma` en bevat de volgende modellen:

- **User**: Gebruikers van de applicatie
- **Artwork**: Kunstwerken in de collectie
- **Artist**: Kunstenaars
- **Location**: Locaties waar kunstwerken zich bevinden
- **ArtworkType**: Types kunstwerken (schilderij, sculptuur, etc.)
- **Image**: Afbeeldingen van kunstwerken
- **Report**: Opgeslagen rapportages

### Relaties

- Een kunstwerk behoort tot één kunstenaar (many-to-one)
- Een kunstwerk bevindt zich op één locatie (many-to-one)
- Een kunstwerk heeft één type (many-to-one)
- Een kunstwerk kan meerdere afbeeldingen hebben (one-to-many)
- Een kunstenaar kan meerdere kunstwerken hebben (one-to-many)
- Een locatie kan meerdere kunstwerken bevatten (one-to-many)

### Migraties

Database migraties worden beheerd door Prisma. Nieuwe migraties kunnen worden aangemaakt met:

```bash
npx prisma migrate dev --name <migration-name>
```

## Authenticatie

### JWT Authenticatie

De applicatie gebruikt JSON Web Tokens (JWT) voor authenticatie. Het authenticatieproces werkt als volgt:

1. Gebruiker logt in met e-mail en wachtwoord
2. Backend valideert de gegevens en genereert een JWT
3. JWT wordt opgeslagen in localStorage op de client
4. JWT wordt meegestuurd bij elke API request in de Authorization header
5. Backend valideert het JWT bij elke beveiligde API request

### Wachtwoord Reset

De wachtwoord reset functionaliteit werkt als volgt:

1. Gebruiker vraagt wachtwoord reset aan met e-mailadres
2. Backend genereert een unieke token en stuurt een e-mail met reset link
3. Gebruiker klikt op de link en voert nieuw wachtwoord in
4. Backend valideert de token en update het wachtwoord

## API Endpoints

### Authenticatie

- `POST /api/auth/login`: Inloggen
- `POST /api/auth/register`: Nieuwe gebruiker registreren
- `POST /api/auth/reset-password`: Wachtwoord reset aanvragen
- `POST /api/auth/update-password`: Wachtwoord updaten

### Kunstwerken

- `GET /api/artworks`: Alle kunstwerken ophalen
- `GET /api/artworks/:id`: Specifiek kunstwerk ophalen
- `POST /api/artworks`: Nieuw kunstwerk toevoegen
- `PUT /api/artworks/:id`: Kunstwerk bijwerken
- `DELETE /api/artworks/:id`: Kunstwerk verwijderen

### Kunstenaars

- `GET /api/artists`: Alle kunstenaars ophalen
- `GET /api/artists/:id`: Specifieke kunstenaar ophalen
- `POST /api/artists`: Nieuwe kunstenaar toevoegen
- `PUT /api/artists/:id`: Kunstenaar bijwerken
- `DELETE /api/artists/:id`: Kunstenaar verwijderen

### Locaties

- `GET /api/locations`: Alle locaties ophalen
- `GET /api/locations/:id`: Specifieke locatie ophalen
- `POST /api/locations`: Nieuwe locatie toevoegen
- `PUT /api/locations/:id`: Locatie bijwerken
- `DELETE /api/locations/:id`: Locatie verwijderen

### Rapportages

- `GET /api/reports`: Alle rapportages ophalen
- `POST /api/reports`: Nieuwe rapportage genereren
- `GET /api/reports/:id`: Specifieke rapportage ophalen

### Gebruikers

- `GET /api/users`: Alle gebruikers ophalen (alleen admin)
- `GET /api/users/:id`: Specifieke gebruiker ophalen
- `POST /api/users`: Nieuwe gebruiker toevoegen (alleen admin)
- `PUT /api/users/:id`: Gebruiker bijwerken
- `DELETE /api/users/:id`: Gebruiker verwijderen (alleen admin)

## Deployment

### Railway.com Configuratie

De applicatie is geconfigureerd voor deployment op Railway.com met de volgende services:

1. **Frontend Service**: React/Vite applicatie
2. **Backend Service**: Next.js API
3. **Database Service**: PostgreSQL database

### Configuratiebestanden

- `railway.toml`: Configuratie voor de frontend service
- `railway-api.toml`: Configuratie voor de backend service
- `railway-db.toml`: Configuratie voor de database service

### Omgevingsvariabelen

De volgende omgevingsvariabelen moeten worden geconfigureerd in Railway.com:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key voor JWT tokens
- `SENDGRID_API_KEY`: API key voor SendGrid
- `FRONTEND_URL`: URL van de frontend applicatie

### Deployment Stappen

1. Railway CLI installeren: `npm install -g @railway/cli`
2. Inloggen: `railway login`
3. Project initialiseren: `railway init`
4. Services deployen: `railway up`

## Testen

### Frontend Tests

Frontend componenten zijn getest op:

- Correcte rendering
- Gebruikersinteractie
- Responsiveness
- Integratie met backend API

### Backend Tests

Backend API endpoints zijn getest op:

- Correcte response codes
- Data validatie
- Authenticatie en autorisatie
- Error handling

### Database Tests

Database functionaliteit is getest op:

- Connectiviteit
- Migraties
- Queries
- Relaties
- Performance

## Onderhoud en Updates

### Aanbevolen Updates

De volgende updates worden aanbevolen voor toekomstige versies:

1. **Performance Optimalisatie**: Database queries optimaliseren voor betere performance
2. **Error Handling**: Verbeterde foutafhandeling implementeren
3. **Caching**: Implementeren van caching voor veelgebruikte data
4. **Monitoring**: Toevoegen van monitoring en logging
5. **Automatische Tests**: Implementeren van geautomatiseerde tests

### Backup Strategie

De volgende backup strategie wordt aanbevolen:

1. Dagelijkse automatische backups van de database
2. Bewaartermijn van 30 dagen voor backups
3. Mogelijkheid tot handmatige backups voor belangrijke wijzigingen

### Versie Beheer

De applicatie gebruikt Git voor versie beheer. De volgende branches worden gebruikt:

- `main`: Productie versie
- `develop`: Ontwikkelversie
- `feature/*`: Feature branches
- `bugfix/*`: Bugfix branches
