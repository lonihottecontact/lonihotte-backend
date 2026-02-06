const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const airtable = require('../services/airtable');

const TABLE = 'DEVIS';

router.get('/', auth, async (req, res) => {
    try {
        const data = await airtable.getAll(TABLE, {
            sort: [{ field: 'Date création', direction: 'desc' }]
        });
        res.json(data);
    } catch (err) {
        console.error('Erreur getDevis:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const data = await airtable.getById(TABLE, req.params.id);
        res.json(data);
    } catch (err) {
        console.error('Erreur getDevisById:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const data = await airtable.create(TABLE, req.body.fields || req.body);
        res.json(data);
    } catch (err) {
        console.error('Erreur createDevis:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const data = await airtable.update(TABLE, req.params.id, req.body.fields || req.body);
        res.json(data);
    } catch (err) {
        console.error('Erreur updateDevis:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const data = await airtable.delete(TABLE, req.params.id);
        res.json(data);
    } catch (err) {
        console.error('Erreur deleteDevis:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
