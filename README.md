# 🏰 Catan Leaderboard

App mobile-first Next.js per gestire la classifica delle partite di Catan tra amici.

## 🚀 Setup

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

Crea un file `scripts/create-user.js`:

```javascript
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/catan.db');
const db = new Database(dbPath);

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Usage: node scripts/create-user.js <username> <password>');
  process.exit(1);
}

const hashedPassword = bcrypt.hashSync(password, 10);

db.prepare(`
  INSERT INTO users (username, password, image)
  VALUES (?, ?, NULL)
`).run(username, hashedPassword);

console.log(`Utente ${username} creato con successo!`);
db.close();
```

Esegui:
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

**Usa lo script:**
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

Vedi [DOCKER.md](./DOCKER.md) per le istruzioni complete.

**Quick start:**
```bash
docker-compose up -d
```

L'app sarà disponibile su `http://localhost:3000`

## 🔐 Sicurezza

- Le password sono hashate con bcrypt
- Le sessioni sono gestite tramite cookie httpOnly
- Autenticazione richiesta per aggiungere partite

## 📝 Note

- Il database viene inizializzato automaticamente al primo avvio
- **Le immagini devono essere caricate manualmente in `public/uploads/`**
- Gli utenti devono essere creati manualmente (vedi sezione Registrazione Utenti)
- Tema scuro attivo di default
