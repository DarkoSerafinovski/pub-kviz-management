# Pub Quiz Management System

Full-stack web aplikacija za organizaciju pub kvizova sa sezonama, događajima i rang listama timova.

## Tehnologije

- React (frontend)
- NestJS (backend)
- Supabase Auth (autentikacija)
- PostgreSQL (baza podataka)
- TypeORM (ORM)

## Autentikacija i autorizacija

- Implementirana preko Supabase Auth
- Role-based pristup (moderator, tim, gost)
- Zaštićene rute na backendu (NestJS guards)

## Opis sistema

Aplikacija omogućava upravljanje pub kviz događajima kroz sezonski sistem, gde timovi učestvuju, skupljaju bodove i prate svoje statistike i rang liste.

Sistem podržava više korisničkih uloga i kompleksnu logiku vezanu za sezonska takmičenja.

## Uloge

- **Moderator**
- **Tim (user)**
- **Gost (guest)**

## Sezone i događaji

- Moderator kreira sezone sa početnim i krajnjim datumom
- Validacije:
  - sezona ne može početi u prošlosti
  - kraj mora biti nakon početka
  - sezona ne može trajati 0 dana
- Događaji se kreiraju unutar sezone i moraju biti u njenim granicama

## Timovi i prijave

- Timovi se registruju sa:
  - nazivom tima
  - logoom
  - email adresom

- Timovi imaju uvid u sve sezone i događaje
- Prijava na događaj:
  - unos članova tima
  - izbor postojećih ili kreiranje novih članova
  - članovi se čuvaju u bazi

- Opcionalno:
  - dodavanje događaja u Google Calendar
  - dodavanje u omiljene

## Rang liste

### Događaj ranking

- prikaz bodova po timu na konkretnom događaju
- moderator ažurira bodove
- klik na tim prikazuje članove tima

### Sezonski ranking

- sumirani bodovi svih događaja u sezoni
- automatska rang lista timova

## Statistika tima

- pregled statistika za svaki tim
- broj učestvovanja
- bodovi kroz vreme
- performanse po sezonama

## Pravila pristupa

- Tim može da menja svoj sastav **pre početka događaja**
- Moderator ima kontrolu nad bodovima i događajima
- Gosti mogu da pregledaju rang liste

## Struktura projekta

- client/ -> React Frontend
- server/ -> NestJS Backend

## Pokretanje projekta

### Backend

```bash
cd server
npm install
npm run start:dev
```

### Frontend

```bash
cd client
npm install
npm start
```
