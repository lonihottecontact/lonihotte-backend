require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const devisRoutes = require('./routes/devis');
const interventionsRoutes = require('./routes/interventions');
const attestationsRoutes = require('./routes/attestations');
const facturesRoutes = require('./routes/factures');

const app = express();
const PORT = process.env.PORT || 3001;

// Sécurité
app.use(helmet());

// CORS - autoriser ton frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser JSON (limite 10MB pour les signatures base64)
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/interventions', interventionsRoutes);
app.use('/api/attestations', attestationsRoutes);
app.use('/api/factures', facturesRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'LONIHOTTE Backend',
        version: '1.0.0'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Démarrage
app.listen(PORT, () => {
    console.log(`🚀 LONIHOTTE Backend démarré sur le port ${PORT}`);
    console.log(`🔐 JWT actif`);
    console.log(`📊 Airtable Base: ${process.env.AIRTABLE_BASE_ID ? '✅ configuré' : '❌ manquant'}`);
});
