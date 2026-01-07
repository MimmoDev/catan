# 🚀 Guida Setup Completa

Questa guida ti aiuterà a configurare l'applicazione Catan Leaderboard da zero.

## 📋 Prerequisiti

- Docker e Docker Compose installati
- Git installato
- Accesso a un terminale/command line

## 🔧 Setup Iniziale

### 1. Clona il Repository

```bash
git clone https://github.com/MimmoDev/catan.git
cd catan
```

### 2. Crea le Cartelle Necessarie

```bash
mkdir -p data public/uploads
```

### 3. Avvia con Docker

```bash
docker-compose up -d
```

Attendi qualche secondo che il container si avvii. Puoi verificare con:

```bash
docker-compose logs -f
```

### 4. Crea il Primo Utente

```bash
docker exec -it catan-leaderboard node scripts/create-user.js admin password123
```

### 5. Accedi all'App

Apri il browser e vai su: **http://localhost:3000**

- Username: `admin`
- Password: `password123`

## 👥 Aggiungere Altri Utenti

### Esempio: Creare 5 utenti

```bash
docker exec -it catan-leaderboard node scripts/create-user.js Soccorso password123
docker exec -it catan-leaderboard node scripts/create-user.js Emidio password123
docker exec -it catan-leaderboard node scripts/create-user.js Silvio password123
docker exec -it catan-leaderboard node scripts/create-user.js Alfredo password123
docker exec -it catan-leaderboard node scripts/create-user.js Stefano password123
docker exec -it catan-leaderboard node scripts/create-user.js Rocco password123
docker exec -it catan-leaderboard node scripts/create-user.js Mimmo password123
```

### Verificare gli Utenti Creati

```bash
docker exec -it catan-leaderboard node scripts/list-users.js
```

## 📸 Aggiungere Immagini Profilo

### 1. Prepara le Immagini

- Scarica o prepara le immagini degli utenti
- Formato consigliato: JPG o PNG
- Dimensione: 200x200px (opzionale, verranno ridimensionate)
- Rinomina i file con lo username (es: `soccorso.jpg`, `emidio.png`)

### 2. Carica le Immagini

Copia le immagini nella cartella `public/uploads/`:

```bash
# Esempio su macOS/Linux
cp ~/Downloads/soccorso.jpg ./public/uploads/
cp ~/Downloads/emidio.png ./public/uploads/
```

### 3. Aggiorna il Database

Per ogni utente, aggiorna il percorso dell'immagine:

```bash
docker exec -it catan-leaderboard node scripts/update-user-image.js Soccorso /uploads/soccorso.jpg
docker exec -it catan-leaderboard node scripts/update-user-image.js Emidio /uploads/emidio.png
```

### 4. Verifica le Immagini

```bash
docker exec -it catan-leaderboard node scripts/check-images.js
```

## 🔄 Aggiornare l'Applicazione

Quando c'è un nuovo aggiornamento sul repository:

### 1. Ferma il Container

```bash
docker-compose down
```

### 2. Aggiorna il Codice

```bash
git pull origin main
```

### 3. Ricostruisci e Riavvia

```bash
docker-compose up -d --build
```

**✅ Il database e le immagini vengono preservati automaticamente!**

## 🗄️ Backup del Database

### Creare un Backup

```bash
# Copia il database
cp ./data/catan.db ./data/catan.db.backup
```

### Ripristinare un Backup

```bash
# Ferma il container
docker-compose down

# Ripristina il backup
cp ./data/catan.db.backup ./data/catan.db

# Riavvia
docker-compose up -d
```

## 🐛 Risoluzione Problemi

### Container non si avvia

```bash
# Vedi i logs
docker-compose logs

# Riavvia
docker-compose restart
```

### Database corrotto

```bash
# Ferma il container
docker-compose down

# Elimina il database (ATTENZIONE: perdi tutti i dati!)
rm ./data/catan.db

# Riavvia (il database verrà ricreato)
docker-compose up -d
```

### Porta 3000 già in uso

Modifica `docker-compose.yml` e cambia la porta:

```yaml
ports:
  - "3001:3000"  # Usa la porta 3001 invece di 3000
```

Poi accedi a http://localhost:3001

### Immagini non visibili

1. Verifica che le immagini siano in `./public/uploads/`
2. Controlla i permessi: `chmod -R 755 ./public/uploads`
3. Verifica il percorso nel database: `docker exec -it catan-leaderboard node scripts/check-images.js`

## 📊 Struttura Dati

```
catan/
├── data/
│   └── catan.db          # Database SQLite (PRESERVATO durante aggiornamenti)
├── public/
│   └── uploads/          # Immagini utenti (PRESERVATE durante aggiornamenti)
│       ├── soccorso.jpg
│       ├── emidio.png
│       └── ...
└── ...
```

## ✅ Checklist Setup Completo

- [ ] Repository clonato
- [ ] Docker Compose avviato
- [ ] Primo utente creato
- [ ] Accesso all'app funzionante
- [ ] Altri utenti creati
- [ ] Immagini profilo caricate
- [ ] Database aggiornato con immagini
- [ ] Tutto funzionante!

## 🎉 Pronto!

Ora puoi iniziare a registrare le partite di Catan!

---

**Nota:** Ricorda di fare backup regolari del database se hai dati importanti!

