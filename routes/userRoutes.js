const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        User.findByUsername(username, (err, existingUser) => {
            if (err) {
                return res.status(500).json({error: 'Erro interno do servidor'});
            }
            if (existingUser) {
                return res.status(400).json({error: 'Usuário já existe'});
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({error: 'Erro interno do servidor'});
                }

                User.create(username, hashedPassword, (err, userId) => {
                    if (err) {
                        return res.status(500).json({error: 'Erro interno do servidor'});
                    }
                    res.status(201).json({message: 'Usuário registrado com sucesso'});
                });
            });
        });
    } catch (e) {
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

module.exports = router;