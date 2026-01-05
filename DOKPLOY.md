# 🚀 Dokploy Deployment Guide

Guida per gestire l'applicazione Catan Leaderboard su Dokploy.

## 👥 Aggiungere Utenti

### Metodo 1: Via Terminale Dokploy (Consigliato)

1. Vai su Dokploy → La tua applicazione → **Terminal** o **Shell**
2. **IMPORTANTE**: Assicurati di essere nella directory `/app`:
   ```bash
   cd /app
   ```
3. Esegui lo script per creare un utente:

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

### Metodo 1: Via Dokploy Terminal (Base64) - PIÙ SEMPLICE

1. **Prepara l'immagine in base64** sul tuo computer locale:
   ```bash
   # Su Mac/Linux
   base64 -i /percorso/immagine.jpg > immagine_base64.txt
   
   # Oppure direttamente nel terminale
   cat /percorso/immagine.jpg | base64
   ```

2. **Nel terminale Dokploy**, vai in `/app` e crea l'immagine:
   ```bash
   cd /app
   mkdir -p public/uploads
   
   # Incolla il base64 e decodificalo (sostituisci BASE64_CONTENT con il contenuto)
   echo "BASE64_CONTENT" | base64 -d > public/uploads/nomefile.jpg
   ```

3. **Aggiorna il database:**
   ```bash
   node scripts/update-user-image.js Username /uploads/nomefile.jpg
   ```

### Metodo 2: Via Docker Volume (Se hai accesso al server)

Se hai montato un volume per `public/uploads` in `docker-compose.yml` o nella configurazione Dokploy:

1. **Trova il percorso del volume sul server host**
2. **Carica le immagini direttamente** in quella cartella (via SCP, FTP, o accesso diretto)
3. **Aggiorna il database** come sopra

### Metodo 3: Via Docker Copy (Se hai accesso SSH al server)

```bash
# Dal tuo computer locale
docker cp /percorso/immagine.jpg <CONTAINER_NAME>:/app/public/uploads/immagine.jpg

# Poi nel container
docker exec -it <CONTAINER_NAME> sh
cd /app
node scripts/update-user-image.js Username /uploads/immagine.jpg
```

### Metodo 4: Via SCP (Se hai accesso SSH)

```bash
# Trova il percorso del volume montato sul server
# Poi carica via SCP
scp immagine.jpg user@server:/path/to/volume/uploads/immagine.jpg

# Poi aggiorna il database nel container
```

### ⚠️ IMPORTANTE: Aggiorna sempre il database

Dopo aver caricato l'immagine, **devi sempre aggiornare il database**:

```bash
cd /app
node scripts/update-user-image.js Username /uploads/nomefile.jpg
```

**Esempio completo:**
```bash
cd /app

# Carica immagine (metodo base64)
echo "BASE64_CONTENT_QUI" | base64 -d > public/uploads/soccorso.jpg

# Aggiorna database
node scripts/update-user-image.js Soccorso /uploads/soccorso.jpg
node scripts/update-user-image.js Emidio /uploads/emidio.jpeg
node scripts/update-user-image.js Silvio /uploads/silvio.jpg
# ... e così via
```

### 📋 Verifica le immagini caricate

```bash
cd /app
ls -la public/uploads/
```

## 🗑️ Eliminare Utenti

### Via Terminale Dokploy

1. Vai su Dokploy → La tua applicazione → **Terminal**
2. **IMPORTANTE**: Assicurati di essere nella directory `/app`:
   ```bash
   cd /app
   ```
3. Esegui lo script per eliminare un utente:

```bash
node scripts/delete-user.js Username
```

**Esempio:**
```bash
node scripts/delete-user.js Admin
```

⚠️ **ATTENZIONE**: Eliminare un utente eliminerà anche tutte le partite vinte da quell'utente (a causa delle foreign key constraints). Se l'utente ha partecipato ad altre partite, quelle partite rimarranno ma senza il suo record di partecipazione.

### Via Docker Exec

```bash
docker exec -it <CONTAINER_NAME> sh
cd /app
node scripts/delete-user.js Username
```

## 🔍 Verificare Utenti Esistenti

### Metodo 1: Script dedicato (Consigliato)

```bash
cd /app
node scripts/list-users.js
```

Questo mostrerà tutti gli utenti con ID, username e immagine.

### Metodo 2: Comando inline

```bash
cd /app
node -e "const db = require('better-sqlite3')('./data/catan.db'); const users = db.prepare('SELECT id, username, image FROM users ORDER BY username').all(); console.log(users); db.close();"
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

