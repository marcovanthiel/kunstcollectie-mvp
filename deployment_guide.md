# Kunstcollectie Deployment Guide

Deze gids bevat instructies voor het deployen van de Kunstcollectie applicatie naar Railway.com.

## Vereisten

- Een GitHub account
- Een Railway.com account
- Een PostgreSQL database op Railway

## Stappen voor deployment

1. Download het bijgevoegde zip-bestand (kunstcollectie_monorepo.zip)
2. Pak het zip-bestand uit
3. Upload alle bestanden naar een nieuwe GitHub repository:
   - Zorg ervoor dat alle bestanden in de root van de repository staan
   - De mapstructuur moet exact overeenkomen met wat in het zip-bestand staat

4. Log in op uw Railway.com dashboard
5. Klik op "New Project" > "Deploy from GitHub repo"
6. Selecteer uw repository
7. Laat de Root Directory leeg (om de root van de repository te gebruiken)
8. Selecteer "dockerfile" als builder (dit is al geconfigureerd in railway.toml)
9. Klik op "Deploy"

## Belangrijke bestanden

- `Dockerfile`: Bevat alle instructies voor het bouwen van de applicatie
- `server.js`: Start zowel de frontend als backend en voert database migraties uit
- `railway.toml`: Configuratie voor Railway deployment
- `backend/.env`: Bevat omgevingsvariabelen voor de backend
- `backend/prisma/schema.prisma`: Database schema definitie

## Troubleshooting

Als u problemen ondervindt tijdens de deployment, controleer de volgende punten:

1. **Mapstructuur**: Zorg ervoor dat alle bestanden in de juiste mappen staan
2. **Database connectie**: Controleer of de DATABASE_URL correct is in railway.toml
3. **Logs**: Bekijk de logs in het Railway dashboard voor meer informatie over eventuele fouten
4. **Prisma migraties**: De migraties worden uitgevoerd tijdens runtime, niet tijdens de build fase

## Na deployment

Na een succesvolle deployment is de applicatie beschikbaar op de URL die Railway genereert (meestal https://kunstcollectie.up.railway.app/).
