# 💾 Backup e Ripristino Database

Guida per fare backup e ripristinare il database Catan Leaderboard.

## ⚠️ IMPORTANTE: Il Database NON è nel Repository

Il database `data/catan.db` è nel `.gitignore` e **NON viene tracciato da Git**. Questo significa che:

- ✅ Il database è locale al tuo computer/server
- ✅ Non viene sovrascritto durante `git pull`
- ⚠️ **NON viene incluso nei commit/push**
- ⚠️ **Se perdi il file, perdi tutti i dati**

## 🔄 Perché il Database si Resetta?

Se il database si resetta dopo un `git pull`, probabilmente:

1. **Volume Docker non montato** - Il volume `./data:/app/data` non è configurato correttamente
2. **Database in posizione sbagliata** - Il database è nella cartella del progetto invece che nel volume
3. **Container ricreato** - Il container è stato ricreato senza preservare i volumi

## ✅ Verifica che il Volume sia Montato

### Con Docker Compose (Locale)

```bash
# Verifica i volumi montati
docker-compose ps
docker volume ls

# Verifica che il database esista
ls -la ./data/catan.db

# Entra nel container e verifica
docker exec -it catan-leaderboard ls -la /app/data/
```

### Su Dokploy

1. Vai su Dokploy → La tua applicazione → **Volumes**
2. Verifica che ci sia un volume montato per `/app/data`
3. Se non c'è, aggiungilo:
   - **Container Path**: `/app/data`
   - **Host Path**: `/var/lib/dokploy/apps/catan/data` (o un percorso persistente)

## 💾 Fare Backup del Database

### Metodo 1: Copia Manuale (Locale)

```bash
# Ferma il container
docker-compose down

# Copia il database
cp ./data/catan.db ./data/catan.db.backup

# Riavvia
docker-compose up -d
```

### Metodo 2: Script di Backup

```bash
# Crea uno script di backup
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
cp ./data/catan.db $BACKUP_DIR/catan.db.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup creato in $BACKUP_DIR"
EOF

chmod +x backup-db.sh
./backup-db.sh
```

### Metodo 3: Backup Automatico (Cron)

Aggiungi al tuo crontab per backup giornalieri:

```bash
# Backup giornaliero alle 2:00 AM
0 2 * * * cd /path/to/catan && cp ./data/catan.db ./backups/catan.db.$(date +\%Y\%m\%d) && find ./backups -name "catan.db.*" -mtime +7 -delete
```

## 🔄 Ripristinare un Backup

### Metodo 1: Da File di Backup

```bash
# Ferma il container
docker-compose down

# Ripristina il backup
cp ./data/catan.db.backup ./data/catan.db

# Riavvia
docker-compose up -d
```

### Metodo 2: Da Backup con Timestamp

```bash
# Lista i backup disponibili
ls -lh ./backups/

# Ripristina un backup specifico
docker-compose down
cp ./backups/catan.db.20250107_140000 ./data/catan.db
docker-compose up -d
```

## 🐛 Risolvere il Problema del Database Resettato

### Problema: Database si resetta dopo git pull

**Causa**: Volume Docker non montato correttamente

**Soluzione**:

1. **Verifica docker-compose.yml**:
```yaml
volumes:
  - ./data:/app/data  # ← Deve essere presente
```

2. **Riavvia con volumi**:
```bash
docker-compose down
docker-compose up -d
```

3. **Verifica che il database esista**:
```bash
ls -la ./data/catan.db
```

### Problema: Database non trovato nel container

**Causa**: Percorso sbagliato o permessi

**Soluzione**:

```bash
# Entra nel container
docker exec -it catan-leaderboard sh

# Verifica il database
ls -la /app/data/
cat /app/data/catan.db  # Dovrebbe esistere

# Se non esiste, verifica i permessi
chmod -R 755 /app/data
```

### Problema: Database perso su Dokploy

**Causa**: Volume non configurato o percorso host errato

**Soluzione**:

1. Vai su Dokploy → Applicazione → **Volumes**
2. Aggiungi volume:
   - **Container Path**: `/app/data`
   - **Host Path**: `/var/lib/dokploy/apps/catan/data`
3. Riavvia l'applicazione
4. Crea di nuovo gli utenti se necessario

## 📊 Verificare lo Stato del Database

### Controllare Utenti

```bash
# Nel container
docker exec -it catan-leaderboard node scripts/list-users.js

# O direttamente
node scripts/list-users.js
```

### Controllare Partite

```bash
# Entra nel container
docker exec -it catan-leaderboard sh

# Apri SQLite
sqlite3 /app/data/catan.db

# Query
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM games;
SELECT COUNT(*) FROM game_participants;

# Esci
.exit
```

## 🔐 Best Practices

1. **Fai backup regolari** - Almeno una volta a settimana
2. **Testa i backup** - Verifica che i backup siano validi
3. **Documenta** - Tieni traccia di quando fai backup
4. **Automatizza** - Usa cron per backup automatici
5. **Verifica volumi** - Controlla sempre che i volumi siano montati

## 📝 Checklist Pre-Deploy

Prima di fare deploy o aggiornamenti:

- [ ] Backup del database fatto
- [ ] Volumi Docker verificati
- [ ] Database esiste e ha dati
- [ ] Backup testato (opzionale ma consigliato)

## 🆘 Recupero Dati Persi

Se hai perso il database e non hai backup:

1. **Controlla i volumi Docker**:
```bash
docker volume ls
docker volume inspect <volume-name>
```

2. **Cerca file temporanei**:
```bash
find . -name "*.db*" -type f
find . -name "*.db-journal" -type f
```

3. **Verifica log**:
```bash
docker-compose logs | grep -i database
docker-compose logs | grep -i error
```

4. **Ultima risorsa**: Ricrea gli utenti manualmente

---

**Ricorda**: Il database è locale e non viene tracciato da Git. Fai sempre backup prima di aggiornamenti importanti!

