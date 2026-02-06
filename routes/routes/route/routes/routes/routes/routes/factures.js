const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const airtable = require('../services/airtable');

const TABLE = 'FACTURES';

router.get('/', auth, async (req, res) => {
    try {
        const data = await airtable.getAll(TABLE, {
            sort: [{ field: 'Date émission', direction: 'desc' }]
        });
        res.json(data);
    } catch (err) {
        console.error('Erreur getFactures:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const data = await airtable.create(TABLE, req.body.fields || req.body);
        res.json(data);
    } catch (err) {
        console.error('Erreur createFacture:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const data = await airtable.update(TABLE, req.params.id, req.body.fields || req.body);
        res.json(data);
    } catch (err) {
        console.error('Erreur updateFacture:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
