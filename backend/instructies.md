# Kunstcollectie Port Fix Instructies

Dit document bevat instructies voor het oplossen van het 404-probleem en de build error in de Kunstcollectie applicatie op Railway.

## Problemen

1. **404 Error**: Uit de logs blijkt dat zowel de frontend als de backend proberen poort 8080 te gebruiken, waardoor de frontend automatisch overschakelt naar poort 8081. Railway routeert echter de hoofdURL naar poort 8080, waar alleen de backend draait.

2. **Build Error**: Er was een syntaxfout in het vite.config.js bestand waardoor de build faalde.

## Oplossing

De oplossing is om:
1. De backend expliciet op poort 3001 te laten draaien en de frontend op poort 8080
2. Het vite.config.js bestand te corrigeren met de juiste syntax

## Bestanden die zijn bijgewerkt

1. `frontend/vite.config.js` - Gecorrigeerd met juiste syntax en poortconfiguratie
2. `backend/.env` - Backend omgevingsvariabelen met correcte database URL
3. `start.sh` - Script dat de backend expliciet op poort 3001 laat draaien en de frontend op poort 8080
4. `railway.toml` - Railway configuratie met de juiste poortinstellingen
5. `nixpacks.toml` - Nixpacks configuratie met de juiste poortinstellingen
6. `index.html` - Test bestand om server functionaliteit te verifiëren

## Deployment Stappen

1. Download het bijgevoegde ZIP-bestand
2. Pak het uit en kopieer de bestanden naar de juiste locaties in uw repository:
   - `frontend/vite.config.js` → naar uw repository frontend map
   - `backend/.env` → naar uw repository backend map
   - `start.sh`, `railway.toml`, `nixpacks.toml`, `index.html` → naar de root van uw repository
3. Maak start.sh uitvoerbaar: `chmod +x start.sh`
4. Commit en push deze bestanden naar GitHub
5. Deploy opnieuw naar Railway

## Verificatie

Na deployment, controleer of de applicatie correct werkt door:
1. De hoofdURL te bezoeken (https://kunstcollectie.up.railway.app/)
2. De logs te controleren in het Railway dashboard om te zien of beide services correct zijn gestart
3. Te navigeren naar verschillende routes zoals /login om te verifiëren dat de routing werkt
