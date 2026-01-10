# 🏰 Catan Leaderboard

App mobile-first Next.js per gestire la classifica delle partite di Catan tra amici.

## 📋 Requisiti

- Docker e Docker Compose (consigliato)
- Oppure Node.js 20+ e npm

## 🚀 Quick Start con Docker

### 1. Clona il repository

```bash
git clone https://github.com/MimmoDev/catan.git
cd catan
```

### 2. Avvia l'applicazione

```bash
# Porta configurabile (default 3000)
HOST_PORT=3000 docker-compose up -d
```

L'app sarà disponibile su **http://localhost:3000** (o sulla porta impostata in `HOST_PORT`).

### 3. Crea il primo utente

```bash
docker exec -it catan-leaderboard node scripts/create-user.js admin password123
```

### 4. Accedi all'app

- Username: `admin`
- Password: `password123`

## 🔄 Aggiornare l'applicazione

Quando fai `git pull` per aggiornare il codice:

```bash
# ⚠️ IMPORTANTE: Fai backup del database prima!
cp ./data/catan.db ./data/catan.db.backup

# Ferma il container
docker-compose down

# Pull del nuovo codice
git pull

# Ricostruisci e riavvia
docker-compose up -d --build
```

**Il database e le immagini vengono preservati automaticamente** grazie ai volumi Docker, **MA** è sempre meglio fare un backup prima!

📖 Vedi [BACKUP.md](./BACKUP.md) per istruzioni dettagliate su backup e ripristino.

## 📦 Setup Locale (senza Docker)

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Avvia il server di sviluppo

```bash
npm run dev
```

Il database SQLite verrà creato automaticamente in `data/catan.db`

### 3. Crea un utente

```bash
node scripts/create-user.js admin password123
```

## 👥 Gestione Utenti

### Creare un utente

**Con Docker:**
```bash
docker exec -it catan-leaderboard node scripts/create-user.js username password
```

**Senza Docker:**
```bash
node scripts/create-user.js username password
```

### Elencare tutti gli utenti

**Con Docker:**
```bash
docker exec -it catan-leaderboard node scripts/list-users.js
```

**Senza Docker:**
```bash
node scripts/list-users.js
```

### Eliminare un utente

**Con Docker:**
```bash
docker exec -it catan-leaderboard node scripts/delete-user.js username
```

**Senza Docker:**
```bash
node scripts/delete-user.js username
```

## 📸 Gestione Immagini Profilo

### 1. Carica l'immagine

Carica l'immagine nella cartella `public/uploads/` con il nome dell'utente:

```
public/uploads/mario.jpg
public/uploads/luigi.png
```

### 2. Aggiorna il database

**Con Docker:**
```bash
docker exec -it catan-leaderboard node scripts/update-user-image.js mario /uploads/mario.jpg
```

**Senza Docker:**
```bash
node scripts/update-user-image.js mario /uploads/mario.jpg
```

### Formato immagini consigliato

- **Dimensione**: 200x200px (vengono mostrate come 48x48px)
- **Formato**: JPG, PNG, WebP
- **Nome file**: Usa lo username (es: `mario.jpg`)

## 🎮 Funzionalità

- ✅ **Login utenti** - Autenticazione sicura con bcrypt
- ✅ **Classifica** - Ordine per vittorie e punteggio totale
- ✅ **Counter partite** - Visualizza il numero totale di partite per ogni giocatore
- ✅ **Aggiunta partite** - Modal con partecipanti e punteggi
- ✅ **Profilo utente** - Storico completo delle partite con dettagli
- ✅ **Eliminazione partite** - Con conferma
- ✅ **Immagini profilo** - Supporto per foto utente
- ✅ **Design mobile-first** - Ottimizzato per smartphone
- ✅ **Tema scuro** - Interfaccia nero/grigio

## 📁 Struttura Progetto

```
catan/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── user/              # Pagine profilo utente
│   └── page.tsx           # Home/Login/Leaderboard
├── components/            # Componenti React
│   ├── ui/               # Componenti shadcn/ui
│   ├── AddGameModal.tsx  # Modale aggiunta partita
│   ├── LeaderboardClient.tsx
│   ├── LoginForm.tsx
│   └── FloatingActionButton.tsx
├── lib/                   # Utilities
│   ├── db/               # Database schema e setup
│   ├── auth.ts           # Autenticazione
│   └── utils.ts          # Utilities
├── public/
│   └── uploads/          # ⬅️ CARICA QUI LE IMMAGINI
├── scripts/              # Script utility
│   ├── create-user.js
│   ├── delete-user.js
│   ├── list-users.js
│   └── update-user-image.js
├── data/                 # Database SQLite (auto-generato)
│   └── catan.db
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🐳 Docker - Comandi Utili

```bash
# Avvia l'applicazione
docker-compose up -d

# Vedi i logs
docker-compose logs -f

# Entra nel container
docker exec -it catan-leaderboard sh

# Ferma il container
docker-compose down

# Riavvia
docker-compose restart

# Rebuild dopo modifiche al codice
docker-compose up -d --build
```

## 💾 Persistenza Dati

I seguenti dati vengono salvati sul tuo computer (volumi Docker):

- `./data/` - Database SQLite (`catan.db`)
- `./public/uploads/` - Immagini profilo utenti

**Importante:** 
- Il database viene preservato durante gli aggiornamenti
- Le immagini devono essere caricate in `./public/uploads/` sul tuo computer
- I volumi Docker garantiscono che i dati non vengano persi quando aggiorni il codice

## 🔧 Script Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server di sviluppo
npm run build        # Build per produzione
npm run start        # Avvia server di produzione
npm run lint         # Lint del codice

# Database
npm run db:generate  # Genera migrazioni Drizzle
npm run db:migrate   # Esegue migrazioni
npm run db:studio    # Apre Drizzle Studio
```

## 🔐 Sicurezza

- Password hashate con bcrypt
- Sessioni gestite tramite cookie httpOnly
- Autenticazione richiesta per tutte le operazioni
- Validazione input con Zod

## 📝 Note Importanti

1. **Nessuna interfaccia di registrazione** - Gli utenti devono essere creati manualmente
2. **Database auto-inizializzato** - Viene creato automaticamente al primo avvio
3. **Immagini manuali** - Le immagini devono essere caricate manualmente in `public/uploads/`
4. **Tema scuro** - Attivo di default
5. **Mobile-first** - Ottimizzato per smartphone

## 🚀 Deploy

### Dokploy / VPS

1. Clona il repository sul server
2. Configura Docker Compose
3. Avvia con `docker-compose up -d`
4. Crea utenti con gli script

### Variabili d'ambiente

Nessuna variabile d'ambiente richiesta. Il database viene creato automaticamente.

## 🐛 Troubleshooting

### Problema: Pagina bianca dopo il login

**Soluzione:** Pulisci la cache del browser o fai un hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Problema: Database non trovato

**Soluzione:** Assicurati che la cartella `data/` esista e abbia i permessi corretti

### Problema: Immagini non visibili

**Soluzione:** 
1. Verifica che le immagini siano in `public/uploads/`
2. Controlla il percorso nel database con `node scripts/check-images.js`
3. Assicurati che il percorso inizi con `/uploads/`

### Problema: Utenti non appaiono nel dropdown

**Soluzione:** 
1. Verifica che gli utenti esistano: `node scripts/list-users.js`
2. Controlla i log del server per errori
3. Riavvia il container: `docker-compose restart`

## 📄 Licenza

Questo progetto è privato e riservato.

## 👨‍💻 Sviluppatore

Creato per gestire le partite di Catan tra amici.

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** 2024
