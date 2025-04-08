# Railway-specifieke configuratie voor Kunstcollectie applicatie

Dit bestand bevat specifieke configuratie-instructies voor het deployen van de Kunstcollectie applicatie op Railway.

## Omgevingsvariabelen instellen

1. Log in op uw Railway dashboard: https://railway.app/dashboard
2. Selecteer uw Kunstcollectie project
3. Ga naar de "Variables" tab
4. Voeg de volgende omgevingsvariabelen toe:

| Naam | Waarde | Beschrijving |
|------|--------|-------------|
| `PORT` | `3000` | De poort waarop de applicatie moet draaien |
| `DATABASE_URL` | `postgresql://postgres:vQWftGjQkBnzpPHUJSbXMkDkkplLvscd@yamanote.proxy.rlwy.net:52257/railway` | De publieke database URL |
| `JWT_SECRET` | `kunstcollectie_app_secret_key_2025` | Secret key voor JWT authenticatie |
| `NODE_ENV` | `production` | Omgeving instelling voor productie |

## Build en Start commando's

Zorg ervoor dat de volgende commando's zijn ingesteld in uw Railway project:

1. Ga naar de "Settings" tab van uw project
2. Scroll naar beneden naar de "Build & Deploy" sectie
3. Stel de volgende commando's in:

| Instelling | Waarde |
|------------|--------|
| Build Command | `npm install && cd backend && npm install && npx prisma generate` |
| Start Command | `node server.js` |

## Poort configuratie

Het is belangrijk dat Railway de poort bepaalt, niet de applicatie. De nieuwe server.js is zo aangepast dat deze exclusief de `PORT` omgevingsvariabele gebruikt die door Railway wordt ingesteld.

Als u nog steeds problemen ondervindt met poortconflicten:

1. Controleer of er andere services in uw Railway project zijn die mogelijk dezelfde poort gebruiken
2. Probeer een andere waarde voor de `PORT` omgevingsvariabele, bijvoorbeeld `8000` of `5000`
3. Controleer of de nieuwste versie van server.js correct is geüpload naar uw repository

## Deployment controleren

Na het instellen van de omgevingsvariabelen en het bijwerken van de commando's:

1. Ga naar de "Deployments" tab
2. Klik op "Redeploy" om een nieuwe deployment te starten
3. Bekijk de logs om te controleren of de applicatie correct start
4. Let op berichten zoals "Server running on port [PORT] provided by Railway"

## Probleemoplossing

Als de deployment nog steeds faalt:

1. Controleer de logs voor specifieke foutmeldingen
2. Verifieer dat alle omgevingsvariabelen correct zijn ingesteld
3. Probeer de applicatie te deployen zonder de backend te starten (commentaar de backend start code uit in server.js)
4. Controleer of de database toegankelijk is door een eenvoudige test query uit te voeren

## Contact

Als u nog steeds problemen ondervindt, neem dan contact op met de ontwikkelaar met de volgende informatie:
- Een screenshot van de Railway logs
- De URL van uw applicatie
- Een lijst van alle ingestelde omgevingsvariabelen (zonder gevoelige waarden)
