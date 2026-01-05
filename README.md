# 🏰 Catan Leaderboard

App mobile-first Next.js per gestire la classifica delle partite di Catan tra amici.

## 🚀 Setup

### Opzione 1: Docker (Consigliato)

Il modo più semplice per avviare l'applicazione:

```bash
# Build e avvia con Docker Compose
docker-compose up -d

# L'app sarà disponibile su http://localhost:3000
```

**Setup iniziale dopo il primo avvio:**
```bash
# Crea il primo utente
docker exec -it catan-leaderboard sh
node scripts/create-user.js admin password123
exit
```

**Gestione:**
```bash
# Vedi i logs
docker-compose logs -f

# Ferma il container
docker-compose down

# Riavvia
docker-compose restart
```

Per maggiori dettagli, vedi [DOCKER.md](./DOCKER.md)

### Opzione 2: Setup Locale

1. Installa le dipendenze:
```bash
npm install
```

2. Inizializza il database (viene creato automaticamente al primo avvio):
```bash
npm run dev
```

Il database SQLite verrà creato in `data/catan.db`

## 👥 Registrazione Utenti

**Non c'è interfaccia di registrazione**. Gli utenti devono essere registrati manualmente nel database.

### Opzione 1: Script Node.js

Lo script `scripts/create-user.js` è già incluso nel progetto.

**Se usi Docker:**
```bash
docker exec -it catan-leaderboard node scripts/create-user.js mario password123
```

**Se usi setup locale:**
```bash
node scripts/create-user.js mario password123
```

### Opzione 2: SQL diretto

Puoi inserire direttamente nel database usando un tool SQLite:

```sql
-- Hash della password "password123" (usa bcrypt per generare il tuo)
INSERT INTO users (username, password, image) 
VALUES ('mario', '$2a$10$...', NULL);
```

## 📸 Gestione Immagini Utenti

### ⬇️ DOVE CARICARE LE IMMAGINI

**Le immagini degli utenti vanno caricate nella cartella:**
```
public/uploads/
```

**Percorso completo:**
```
/Users/domenico/Desktop/catan/public/uploads/
```

### Formato immagini

- **Nome file**: suggerisco di usare lo username (es: `mario.jpg`, `luigi.png`, `soccorso.jpg`)
- **Formato**: JPG, PNG, WebP
- **Dimensione consigliata**: 200x200px (verranno mostrate come 48x48px nella classifica)
- **Esempio nomi file**:
  - `soccorso.jpg`
  - `emidio.png`
  - `silvio.jpg`
  - `alfredo.png`
  - `stefano.jpg`
  - `rocco.png`
  - `mimmo.jpg`

### Aggiornare il database con l'immagine

Dopo aver caricato l'immagine in `public/uploads/`, aggiorna il database:

**Se usi Docker:**
```bash
docker exec -it catan-leaderboard node scripts/update-user-image.js mario /uploads/mario.jpg
```

**Se usi setup locale:**
```bash
node scripts/update-user-image.js mario /uploads/mario.jpg
```

**Oppure SQL diretto:**
```sql
UPDATE users 
SET image = '/uploads/mario.jpg' 
WHERE username = 'mario';
```

### Esempio completo

1. Carica `soccorso.jpg` in `public/uploads/soccorso.jpg`
2. Esegui: `node scripts/update-user-image.js Soccorso /uploads/soccorso.jpg`
3. L'immagine apparirà nella classifica!

## 🎮 Funzionalità

- ✅ Login utenti
- ✅ Aggiunta partite vinte (vincitore, sede, data/ora)
- ✅ Aggiunta partecipanti con punteggi
- ✅ Classifica aggiornata automaticamente (vittorie + punteggio totale)
- ✅ Visualizzazione partite recenti
- ✅ Supporto immagini profilo
- ✅ Design mobile-first con shadcn/ui
- ✅ Tema scuro (nero/grigio)

## 📁 Struttura Progetto

```
catan/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── leaderboard/       # Redirect alla home
│   └── page.tsx           # Pagina home/login
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
│   └── uploads/          # ⬅️ CARICA QUI LE IMMAGINI UTENTI
├── scripts/              # Script utility
│   ├── create-user.js
│   └── update-user-image.js
└── data/                 # Database SQLite (auto-generato)
    └── catan.db
```

## 🔧 Script Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build per produzione
- `npm run start` - Avvia il server di produzione
- `npm run db:studio` - Apri Drizzle Studio per gestire il DB

## 🐳 Docker

### Quick Start

```bash
# Avvia l'applicazione
docker-compose up -d

# L'app sarà disponibile su http://localhost:3000
```

### Comandi Utili

```bash
# Vedi i logs
docker-compose logs -f

# Entra nel container
docker exec -it catan-leaderboard sh

# Crea un utente (dal container)
docker exec -it catan-leaderboard node scripts/create-user.js username password

# Aggiorna immagine utente (dal container)
docker exec -it catan-leaderboard node scripts/update-user-image.js username /uploads/image.jpg

# Ferma il container
docker-compose down

# Riavvia
docker-compose restart

# Rebuild dopo modifiche
docker-compose up -d --build
```

### Volumi Persistenti

I seguenti dati vengono salvati sul tuo computer:
- `./data` - Database SQLite
- `./public/uploads` - Immagini utenti

**Importante:** Carica le immagini in `./public/uploads/` sul tuo computer, non nel container!

Per istruzioni dettagliate, vedi [DOCKER.md](./DOCKER.md)

## 🔐 Sicurezza

- Le password sono hashate con bcrypt
- Le sessioni sono gestite tramite cookie httpOnly
- Autenticazione richiesta per aggiungere partite

## 📝 Note

- Il database viene inizializzato automaticamente al primo avvio
- **Le immagini devono essere caricate manualmente in `public/uploads/`**
- Gli utenti devono essere creati manualmente (vedi sezione Registrazione Utenti)
- Tema scuro attivo di default

## 🚀 Deploy su Dokploy

Vedi [DOKPLOY.md](./DOKPLOY.md) per le istruzioni complete su come gestire utenti e immagini dopo il deploy.
