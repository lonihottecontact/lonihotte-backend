# LONIHOTTE Backend

Backend sécurisé pour l'application LONIHOTTE.
Proxy entre le frontend et Airtable avec authentification JWT et cache.

## Déploiement sur Render

1. Push ce code sur ton repo GitHub `lonihotte-backend`
2. Sur Render, connecte le repo
3. Ajoute les variables d'environnement :
   - `PORT` = `3001`
   - `JWT_SECRET` = (généré automatiquement)
   - `AIRTABLE_TOKEN` = ton token Airtable (pat_xxx...)
   - `AIRTABLE_BASE_ID` = ton Base ID (appXXX...)
4. Build command : `npm install`
5. Start command : `node server.js`
6. Déploie !

## Structure

```
server.js          → Point d'entrée Express
routes/
  auth.js          → Login JWT
  clients.js       → CRUD Clients
  devis.js         → CRUD Devis
  interventions.js → CRUD Interventions
  attestations.js  → CRUD Attestations
  factures.js      → CRUD Factures
middleware/
  auth.js          → Vérification JWT
services/
  airtable.js      → Client Airtable avec cache
```

## API Endpoints

- `POST /api/auth/login` → Login (retourne JWT)
- `GET /api/auth/me` → Vérifier session
- `GET/POST/PATCH/DELETE /api/clients`
- `GET/POST/PATCH/DELETE /api/devis`
- `GET/POST/PATCH/DELETE /api/interventions`
- `GET/POST /api/attestations`
- `GET/POST/PATCH /api/factures`
