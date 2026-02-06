const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const airtable = require('../services/airtable');

const TABLE = 'ATTESTATIONS';

router.get('/', auth, async (req, res) => {
    try {
        const data = await airtable.getAll(TABLE);
        res.json(data);
    } catch (err) {
        console.error('Erreur getAttestations:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const data = await airtable.create(TABLE, req.body.fields || req.body);
        res.json(data);
    } catch (err) {
        console.error('Erreur createAttestation:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
