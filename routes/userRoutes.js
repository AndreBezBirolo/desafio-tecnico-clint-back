const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');


router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        User.findByUsername(username, (err, existingUser) => {
            if (err) {
                return res.status(500).json({error: 'Internal server error'});
            }
            if (existingUser) {
                return res.status(400).json({error: 'User already exists'});
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({error: 'Internal server error'});
                }

                User.create(username, hashedPassword, (err, userId) => {
                    if (err) {
                        return res.status(500).json({error: 'Internal server error'});
                    }

                    const token = jwt.sign(
                        {userId: userId, username: username},
                        process.env.JWT_SECRET,
                        {expiresIn: '1h'}
                    );

                    res.status(201).json({message: 'User registered successfully', token: token});
                });
            });
        });
    } catch (e) {
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;

    User.findByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({error: 'Internal server error'});
        }
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({error: 'Internal server error'});
            }
            if (!result) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            const token = jwt.sign(
                {userId: user.id, username: user.username},
                process.env.JWT_SECRET,
                {expiresIn: '1h'}
            );

            res.json({token});
        });
    });
});

router.post('/renew-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        const newToken = jwt.sign(
            {userId: decoded.userId, username: decoded.username},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({token: newToken});
    });
});


module.exports = router;