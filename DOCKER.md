# 🐳 Docker Setup

Guida per dockerizzare e deployare l'applicazione Catan Leaderboard.

## 🚀 Build e Run con Docker

### Opzione 1: Docker Compose (Consigliato)

```bash
# Build e avvia il container
docker-compose up -d

# Vedi i logs
docker-compose logs -f

# Ferma il container
docker-compose down
```

L'app sarà disponibile su `http://localhost:3000`

### Opzione 2: Docker CLI

```bash
# Build dell'immagine
docker build -t catan-leaderboard .

# Run del container
docker run -d \
  --name catan-leaderboard \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  catan-leaderboard
```

## 📦 Volumi

I seguenti volumi vengono montati per persistere i dati:

- `./data` → Database SQLite
- `./public/uploads` → Immagini utenti

## 🔧 Comandi Utili

```bash
# Entra nel container
docker exec -it catan-leaderboard sh

# Vedi i logs
docker logs catan-leaderboard

# Riavvia il container
docker restart catan-leaderboard

# Rimuovi container e immagine
docker-compose down
docker rmi catan-leaderboard
```

## 🌐 Deploy su Server

### 1. Copia i file sul server

```bash
scp -r . user@server:/path/to/catan
```

### 2. Sul server, esegui:

```bash
cd /path/to/catan
docker-compose up -d
```

### 3. Setup iniziale

Dopo il primo avvio, crea gli utenti:

```bash
docker exec -it catan-leaderboard sh
node scripts/create-user.js username password
```

## 🔒 Sicurezza

- Il container gira come utente non-root (`nextjs`)
- Porta 3000 esposta solo internamente (usa un reverse proxy per HTTPS)
- Database e uploads sono persistenti tramite volumi

## 📝 Note

- Il database viene creato automaticamente al primo avvio
- Le immagini vanno caricate nella cartella `public/uploads` sul host
- Per aggiornare l'app: `docker-compose up -d --build`

