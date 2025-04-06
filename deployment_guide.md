# Kunstcollectie Deployment Guide

Dit document beschrijft het deployment proces voor de Kunstcollectie applicatie op Railway.com.

## Overzicht

De Kunstcollectie applicatie bestaat uit twee hoofdcomponenten:
1. Frontend: Een React applicatie gebouwd met Vite
2. Backend: Een Next.js API server met Prisma ORM

Voor eenvoudige deployment zijn beide componenten geconfigureerd om vanuit één repository te worden gedeployed met een enkele Docker configuratie.

## Vereisten

- Een Railway.com account
- Een PostgreSQL database op Railway (reeds opgezet)
- Git repository met de applicatiecode

## Deployment Stappen

### 1. Repository Voorbereiden

Zorg ervoor dat de volgende bestanden correct zijn geconfigureerd in de root van uw repository:

- `Dockerfile`: Bevat instructies voor het bouwen van zowel frontend als backend
- `start.sh`: Script om beide services te starten
- `railway.toml`: Railway configuratie met omgevingsvariabelen

### 2. Deployment op Railway

1. Log in op uw Railway.com dashboard
2. Klik op "New Project" > "Deploy from GitHub repo"
3. Selecteer uw repository
4. Zorg ervoor dat de Root Directory leeg is (om de root van de repository te gebruiken)
5. Selecteer "Docker" als builder
6. Klik op "Deploy"

### 3. Omgevingsvariabelen

De volgende omgevingsvariabelen worden automatisch geconfigureerd via railway.toml:

- `DATABASE_URL`: Verbindingsstring voor de PostgreSQL database
- `JWT_SECRET`: Geheime sleutel voor JWT authenticatie
- `FRONTEND_URL`: URL van de gedeployde applicatie
- `PORT`: Poort voor de frontend service (standaard 3000)
- `BACKEND_PORT`: Poort voor de backend service (standaard 3001)

### 4. Database Migratie

De database migratie wordt automatisch uitgevoerd tijdens het buildproces via Prisma.

### 5. Monitoring

Na deployment kunt u de logs bekijken in het Railway dashboard om eventuele problemen op te sporen.

## Troubleshooting

### Veelvoorkomende Problemen

1. **Build Fouten**: Controleer de build logs in Railway voor specifieke foutmeldingen.
2. **Database Connectie Problemen**: Verifieer dat de DATABASE_URL correct is en dat de database toegankelijk is.
3. **Frontend/Backend Communicatie**: Controleer of FRONTEND_URL correct is ingesteld.

## Onderhoud

Voor toekomstige updates:
1. Push wijzigingen naar uw GitHub repository
2. Railway zal automatisch een nieuwe deployment starten

## Conclusie

Met deze configuratie worden zowel de frontend als backend gedeployed als één service, wat het beheer vereenvoudigt. De applicatie is nu toegankelijk via de door Railway toegewezen URL.
