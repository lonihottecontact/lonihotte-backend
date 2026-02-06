const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const USERS = [
    {
        id: 'user_loris',
        email: 'contact@lonihotte.fr',
        password: 'Loni2026',
        nom: 'Loris',
        role: 'Admin',
        actif: true
    },
    {
        id: 'user_joy',
        email: 'joy.business@lonihotte.fr',
        password: 'Nivois1401',
        nom: 'Joy',
        role: 'Secrétaire',
        actif: true
    }
];

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    const user = USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.actif === true
    );
    
    if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign(
        { id: user.id, nom: user.nom, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
    
    res.json({
        token,
        user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
    });
});

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non connecté' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Token expiré' });
    }
});

module.exports = router;
