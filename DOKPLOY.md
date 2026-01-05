# 🚀 Dokploy Deployment Guide

Guida per gestire l'applicazione Catan Leaderboard su Dokploy.

## 👥 Aggiungere Utenti

### Metodo 1: Via Terminale Dokploy (Consigliato)

1. Vai su Dokploy → La tua applicazione → **Terminal** o **Shell**
2. Esegui lo script per creare un utente:

```bash
node scripts/create-user.js Username password123
```

**Esempio:**
```bash
node scripts/create-user.js Soccorso password123
node scripts/create-user.js Emidio password123
node scripts/create-user.js Silvio password123
node scripts/create-user.js Alfredo password123
node scripts/create-user.js Stefano password123
node scripts/create-user.js Rocco password123
node scripts/create-user.js Mimmo password123
```

### Metodo 2: Via SSH al Server

Se hai accesso SSH al server dove gira Dokploy:

```bash
# Trova il container
docker ps | grep catan

# Entra nel container (sostituisci CONTAINER_ID o CONTAINER_NAME)
docker exec -it <CONTAINER_ID> sh

# Crea utente
node scripts/create-user.js Username password123
```

### Metodo 3: Via Docker Exec (se conosci il nome del container)

```bash
docker exec -it catan-leaderboard sh
node scripts/create-user.js Username password123
```

## 📸 Aggiungere Immagini Utenti

### 1. Carica le immagini

Le immagini devono essere caricate nella cartella `public/uploads/` del container.

**Via Dokploy Terminal:**
```bash
# Crea la cartella se non esiste
mkdir -p public/uploads

# Carica le immagini (puoi usare un tool di upload o SCP)
# Esempio: se hai accesso SSH, puoi fare:
# scp immagine.jpg user@server:/path/to/container/public/uploads/
```

**Via Docker Volume:**
Se hai montato un volume per `public/uploads`, carica le immagini direttamente sul server nella cartella montata.

### 2. Aggiorna il database

Dopo aver caricato l'immagine, aggiorna il database:

```bash
node scripts/update-user-image.js Username /uploads/nomefile.jpg
```

**Esempio:**
```bash
node scripts/update-user-image.js Soccorso /uploads/soccorso.jpg
node scripts/update-user-image.js Emidio /uploads/emidio.jpeg
```

## 🔍 Verificare Utenti Esistenti

```bash
# Controlla gli utenti nel database
node -e "const db = require('better-sqlite3')('./data/catan.db'); console.log(db.prepare('SELECT id, username, image FROM users').all()); db.close();"
```

## 📝 Note Importanti

- Il database si trova in `/app/data/catan.db` nel container
- Le immagini devono essere in `/app/public/uploads/` nel container
- Se usi volumi persistenti, i dati sono salvati sul server host
- Dopo ogni modifica, l'app si aggiorna automaticamente (se configurato il restart)

## 🛠️ Comandi Utili

```bash
# Vedi i logs
docker logs <CONTAINER_NAME>

# Riavvia il container
docker restart <CONTAINER_NAME>

# Entra nel container
docker exec -it <CONTAINER_NAME> sh

# Verifica che il database esista
ls -la /app/data/

# Verifica le immagini caricate
ls -la /app/public/uploads/
```

