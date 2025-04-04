# Kunstcollectie Applicatie

Een professionele, schaalbare en veilige cloud-gebaseerde webapplicatie voor het archiveren en beheren van een kunstcollectie.

## Overzicht

Deze applicatie stelt gebruikers in staat om hun kunstcollectie te beheren, inclusief kunstwerken, kunstenaars en locaties. De applicatie biedt uitgebreide functionaliteiten voor het bijhouden van details, genereren van rapportages en het beheren van administratieve taken.

## Technische Stack

- **Front-end**: React.js + Vite
- **Back-end**: Next.js
- **Database**: PostgreSQL
- **API**: RESTful
- **Hosting**: Railway.com
- **E-mail service**: SendGrid

## Hoofdfunctionaliteiten

### Kunstwerken Beheer
- Toevoegen, wijzigen, verwijderen, verkopen of uitlenen van kunstwerken
- Beheer van kunstwerk details zoals kunstenaar, type, afmetingen, productiedatum, etc.
- Ondersteuning voor maximaal 15 foto's per kunstwerk
- Bijlagen in PDF en DOCX formaat

### Kunstenaars Beheer
- Beheer van kunstenaarsgegevens
- Biografie en contactinformatie
- Overzicht van kunstwerken per kunstenaar

### Locaties Beheer
- Beheer van locatiegegevens met kaartweergave
- Overzicht van kunstwerken per locatie

### Rapportages
- Overzichtsrapportages met selecteerbare velden
- Waarderapportages per kunstenaar, locatie of type kunstwerk
- Export naar DOCX, XLS, XML en PDF

### Administratief
- Gebruikersbeheer met admin en read-only accounts
- XLS-import/export voor kunstwerken, kunstenaars en locaties
- Automatische back-ups en herstelmogelijkheden

## Installatie

Gedetailleerde installatie-instructies zijn beschikbaar in de [documentatie](./docs/installation.md).

## Ontwikkeling

Zie het [ontwikkelingsplan](./development_plan.md) voor gedetailleerde informatie over de architectuur en implementatie.

## Licentie

Dit project is eigendom van de opdrachtgever en mag niet worden gedeeld of hergebruikt zonder uitdrukkelijke toestemming.
