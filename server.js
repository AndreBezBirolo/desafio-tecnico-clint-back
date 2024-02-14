const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db/db');

app.use(express.json());

app.get('/tasks', (req, res) => {
    const {sort, filter} = req.query;

    let sqlCommand = 'SELECT * FROM tasks';

    if (filter) {
        sqlCommand += ` WHERE status = '${filter}'`;
    }

    if (sort) {
        sqlCommand += ` ORDER BY ${sort}`;
    }

    db.all(sqlCommand, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});