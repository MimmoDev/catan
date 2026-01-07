# 🚀 Deploy su Dokploy

Guida completa per il deploy dell'applicazione Catan Leaderboard su Dokploy.

## 📋 Prerequisiti

- Account Dokploy configurato
- Accesso al server Dokploy
- Repository Git (GitHub o Gitea)

## 🔧 Configurazione Repository

### Opzione 1: Usa Gitea (Consigliato se GitHub non è raggiungibile)

Se hai problemi di connessione a GitHub, usa il repository Gitea:

**URL Repository:** `https://git.mimmodev.com/mimmo/Catan.git`

### Opzione 2: Usa GitHub

**URL Repository:** `https://github.com/MimmoDev/catan.git`

## 🐳 Setup in Dokploy

### 1. Crea una Nuova Applicazione

1. Vai su Dokploy Dashboard
2. Clicca su "New Application"
3. Scegli "Git Repository"
4. Inserisci l'URL del repository:
   - Gitea: `https://git.mimmodev.com/mimmo/Catan.git`
   - GitHub: `https://github.com/MimmoDev/catan.git`

### 2. Configurazione Build

Dokploy userà automaticamente `nixpacks.toml` per il build. Non serve configurazione aggiuntiva.

### 3. Variabili d'Ambiente

**Nessuna variabile d'ambiente richiesta** - L'app funziona out-of-the-box.

### 4. Volumi Persistenti

**IMPORTANTE:** Configura questi volumi per preservare i dati:

| Percorso Container | Percorso Host | Descrizione |
|-------------------|---------------|-------------|
| `/app/data` | `/var/lib/dokploy/apps/catan/data` | Database SQLite |
| `/app/public/uploads` | `/var/lib/dokploy/apps/catan/uploads` | Immagini utenti |

### 5. Porta

Configura la porta: **3000**

### 6. Comando Start

Il comando di start è già configurato in `nixpacks.toml`:
```
node .next/standalone/server.js
```

## 👥 Gestione Utenti su Dokploy

### Accedi al Container

Dalla dashboard Dokploy, apri il terminale dell'applicazione.

### Crea un Utente

```bash
cd /app
node scripts/create-user.js admin password123
```

### Crea Altri Utenti

```bash
node scripts/create-user.js Soccorso password123
node scripts/create-user.js Emidio password123
node scripts/create-user.js Silvio password123
node scripts/create-user.js Alfredo password123
node scripts/create-user.js Stefano password123
node scripts/create-user.js Rocco password123
node scripts/create-user.js Mimmo password123
```

### Elenca Utenti

```bash
node scripts/list-users.js
```

### Elimina Utente

```bash
node scripts/delete-user.js username
```

## 📸 Gestione Immagini su Dokploy

### 1. Carica le Immagini

Le immagini devono essere caricate sul server Dokploy nella cartella del volume:

```bash
# Sul server Dokploy (non nel container)
# Le immagini vanno nella cartella del volume configurato
# Esempio: /var/lib/dokploy/apps/catan/uploads/
```

### 2. Aggiorna il Database

Dal terminale del container:

```bash
cd /app
node scripts/update-user-image.js Soccorso /uploads/soccorso.jpg
node scripts/update-user-image.js Emidio /uploads/emidio.png
```

### 3. Verifica Immagini

```bash
node scripts/check-images.js
```

## 🔄 Aggiornare l'Applicazione

### Metodo 1: Auto-Deploy (Consigliato)

Se hai configurato webhook in Dokploy:

1. Fai `git push` sul repository
2. Dokploy rileverà automaticamente il push
3. Farà il rebuild e il redeploy
4. **I volumi preservano il database e le immagini**

### Metodo 2: Manuale

1. Dalla dashboard Dokploy, clicca su "Redeploy"
2. Dokploy farà `git pull` e rebuild
3. **I volumi preservano il database e le immagini**

## 🐛 Troubleshooting

### Errore: `getaddrinfo EAI_AGAIN api.github.com`

**Problema:** Dokploy non riesce a raggiungere GitHub.

**Soluzioni:**

1. **Usa Gitea invece di GitHub:**
   - Vai nelle impostazioni dell'applicazione
   - Cambia l'URL del repository con: `https://git.mimmodev.com/mimmo/Catan.git`
   - Salva e riprova il deploy

2. **Verifica la connettività di rete:**
   - Assicurati che il server Dokploy possa raggiungere internet
   - Controlla firewall/proxy

3. **Usa SSH invece di HTTPS:**
   - Se hai accesso SSH, configura il repository con URL SSH
   - Esempio: `git@github.com:MimmoDev/catan.git`

### Errore: Database non trovato

**Soluzione:**
1. Verifica che il volume `/app/data` sia montato correttamente
2. Controlla i permessi: `chmod -R 755 /app/data`
3. Riavvia il container

### Errore: Immagini non visibili

**Soluzione:**
1. Verifica che il volume `/app/public/uploads` sia montato
2. Controlla che le immagini siano nella cartella corretta
3. Verifica i percorsi nel database: `node scripts/check-images.js`

### Errore: Utenti non appaiono nel dropdown

**Soluzione:**
1. Verifica che gli utenti esistano: `node scripts/list-users.js`
2. Controlla i log dell'applicazione per errori
3. Riavvia il container

### Errore: Build fallisce

**Soluzione:**
1. Verifica che `nixpacks.toml` sia presente nel repository
2. Controlla i log di build per errori specifici
3. Assicurati che tutte le dipendenze siano in `package.json`

## 📊 Struttura Volumi

```
Server Dokploy:
├── /var/lib/dokploy/apps/catan/
│   ├── data/
│   │   └── catan.db          # Database (PRESERVATO)
│   └── uploads/              # Immagini (PRESERVATE)
│       ├── soccorso.jpg
│       └── ...
```

## ✅ Checklist Deploy

- [ ] Repository configurato in Dokploy
- [ ] Volumi persistenti configurati
- [ ] Porta 3000 configurata
- [ ] Deploy completato con successo
- [ ] Primo utente creato
- [ ] Accesso all'app funzionante
- [ ] Immagini caricate e configurate
- [ ] Tutto funzionante!

## 🔐 Sicurezza

- Le password sono hashate con bcrypt
- Le sessioni sono gestite tramite cookie httpOnly
- Autenticazione richiesta per tutte le operazioni
- Database SQLite locale (non esposto all'esterno)

## 📝 Note Importanti

1. **Backup regolari:** Fai backup del volume `/app/data` regolarmente
2. **Immagini:** Carica le immagini sul server, non nel container
3. **Aggiornamenti:** I volumi preservano i dati durante gli aggiornamenti
4. **Performance:** SQLite è perfetto per piccole/medie applicazioni

## 🆘 Supporto

Se hai problemi:

1. Controlla i log dell'applicazione in Dokploy
2. Verifica la configurazione dei volumi
3. Controlla che il repository sia accessibile
4. Verifica i permessi delle cartelle

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** 2024
