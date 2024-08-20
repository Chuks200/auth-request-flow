const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const mockUser = {
    username: 'authguy',
    password: 'mypassword',
    profile: {
        firstName: 'Chris',
        lastName: 'Wolstenholme',
        age: 43
    }
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === mockUser.username && password === mockUser.password) {
        const token = jwt.sign({ username: mockUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

router.get('/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ profile: mockUser.profile });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;
