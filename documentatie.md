# Kunstcollectie Applicatie - Documentatie van Reparaties en Verbeteringen

## Inleiding

Dit document bevat een overzicht van alle reparaties en verbeteringen die zijn aangebracht aan de Kunstcollectie applicatie om de login-functionaliteit en algemene werking te herstellen. De aanpassingen zijn gegroepeerd per categorie en bevatten technische details voor ontwikkelaars en beheerders.

## 1. Database Connectiviteit Problemen

### 1.1 Ontbrekende PostgreSQL Client Module

**Probleem:** De applicatie kon geen verbinding maken met de PostgreSQL database omdat de 'pg' module ontbrak.

**Oplossing:** 
- De PostgreSQL client module ('pg') is geïnstalleerd via npm:
```
npm install pg
```
- Deze module is toegevoegd aan de package.json dependencies om ervoor te zorgen dat deze bij toekomstige installaties automatisch wordt meegenomen.

### 1.2 Database URL Configuratie

**Probleem:** De applicatie gebruikte een interne Railway database URL (postgres.railway.internal) die alleen toegankelijk is binnen de Railway infrastructuur.

**Oplossing:**
- De database URL in het .env bestand is bijgewerkt om de publieke URL te gebruiken:
```
DATABASE_URL="postgresql://postgres:vQWftGjQkBnzpPHUJSbXMkDkkplLvscd@yamanote.proxy.rlwy.net:52257/railway"
```
- Deze publieke URL is toegankelijk vanaf elke locatie, niet alleen binnen de Railway infrastructuur.

## 2. Database Schema Problemen

### 2.1 ID Veld Type Mismatch

**Probleem:** Er was een type-mismatch tussen het Prisma schema en de database. Het schema verwachtte dat User ID's UUID strings waren, maar in de database waren het numerieke waarden.

**Oplossing:**
- Een migratiescript (migrate-database.js) is gemaakt dat:
  - Een backup maakt van de bestaande gebruikersgegevens
  - De foreign key constraints verwijdert
  - De gebruikers-ID's migreert van numerieke waarden naar UUID strings
  - De relaties tussen tabellen herstelt
- Dit script wordt automatisch uitgevoerd bij het opstarten van de applicatie.

### 2.2 Prisma Schema Aanpassingen

**Probleem:** Het Prisma schema kwam niet overeen met de werkelijke database structuur, wat leidde tot fouten bij het uitvoeren van queries.

**Oplossing:**
- Het Prisma schema is bijgewerkt om overeen te komen met de werkelijke database structuur:
  - User model aangepast om UUID's te gebruiken als ID
  - Artwork model aangepast om de juiste velden en relaties te hebben
  - Relaties tussen modellen gecorrigeerd
- Het bijgewerkte schema is getest en werkt correct met de database.

## 3. Automatisering van Database Fixes

### 3.1 Database Setup Script

**Probleem:** De applicatie vereiste handmatige database setup en migratie, wat foutgevoelig was.

**Oplossing:**
- Een setup-database.js script is gemaakt dat:
  - Controleert of er gebruikers bestaan in de database
  - Standaard admin gebruikers aanmaakt indien nodig
  - Standaard artwork types aanmaakt indien nodig
- Dit script wordt automatisch uitgevoerd bij het opstarten van de applicatie.

### 3.2 Server Startup Proces

**Probleem:** De applicatie had geen geautomatiseerd opstartproces dat database migraties en setup afhandelt.

**Oplossing:**
- Een verbeterd server.js bestand is gemaakt dat:
  - Prisma client genereert
  - Database migraties uitvoert
  - Het database migratiescript uitvoert
  - Het database setup script uitvoert
  - De backend server start
  - Proxy middleware instelt voor API requests
  - Foutafhandeling bevat om door te gaan ondanks eventuele fouten
- Dit zorgt voor een robuuste opstart van de applicatie zonder handmatige interventie.

## 4. Prestatie Optimalisaties

Op basis van prestatie tests zijn de volgende optimalisaties aanbevolen:

1. **Database Indexen:**
   - Voeg een index toe op het 'title' veld van de Artwork tabel voor snellere tekstzoekopdrachten
   - Voeg een samengestelde index toe op (artist, price, sold) voor complexe queries

2. **Paginering:**
   - Implementeer cursor-based paginering in plaats van offset paginering voor betere prestaties bij het bladeren door grote datasets

3. **Query Optimalisaties:**
   - Beperk het aantal velden dat wordt opgehaald in queries door specifieke selecties te gebruiken
   - Gebruik waar mogelijk eager loading met 'include' om het N+1 query probleem te voorkomen

## 5. Responsive Design Verbeteringen

De responsive design van de applicatie is getest en werkt correct op verschillende schermformaten. De volgende elementen zijn gecontroleerd:

1. **Kunstwerk Galerij:**
   - Past zich automatisch aan verschillende schermformaten aan
   - Verandert van een 4-koloms grid naar een 2-koloms grid op tablets en een 1-koloms grid op mobiele apparaten

2. **Formulieren:**
   - Invoervelden nemen de volledige breedte in op kleinere schermen
   - Labels en invoervelden zijn goed leesbaar op alle schermformaten

3. **Zoek- en Filterfunctionaliteit:**
   - Zoekvelden en filters passen zich aan de beschikbare ruimte aan
   - Dropdown menu's zijn goed bruikbaar op touchscreens

## 6. Geteste Functionaliteiten

De volgende functionaliteiten zijn getest en werken correct:

1. **Gebruikersregistratie en Login:**
   - Gebruikers kunnen zich registreren met e-mail en wachtwoord
   - Gebruikers kunnen inloggen met hun inloggegevens
   - Wachtwoorden worden veilig opgeslagen met bcrypt hashing

2. **Kunstwerk Beheer:**
   - Kunstwerken kunnen worden aangemaakt, bekeken, bijgewerkt en verwijderd
   - Relaties met gebruikers worden correct bijgehouden

3. **Zoeken en Filteren:**
   - Kunstwerken kunnen worden gezocht op titel en artiest
   - Filtering op prijs en verkocht status werkt correct
   - Gecombineerde zoekopdrachten en filters werken zoals verwacht

## 7. Conclusie

De login-functionaliteit en algemene werking van de Kunstcollectie applicatie zijn succesvol hersteld. De belangrijkste problemen waren gerelateerd aan database connectiviteit en schema mismatches, die nu zijn opgelost. Daarnaast zijn er verbeteringen aangebracht in de automatisering van database setup en migratie, waardoor de applicatie robuuster en gebruiksvriendelijker is geworden.

De applicatie is nu klaar voor gebruik en kan worden gedeployed zonder handmatige configuratie of setup stappen.
