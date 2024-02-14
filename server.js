const express = require('express');
const {body, validationResult} = require('express-validator');
const app = express();
const PORT = 3000;
const db = require('./db/db');
const taskValidationRules = [
    body('name').notEmpty().withMessage('O campo nome é obrigatório'),
    body('status').isIn(['To do', 'Doing', 'Ready']).withMessage('O campo status deve ser "To Do", "Doing" ou "Ready"'),
    body('due_date').isISO8601().toDate().withMessage('O campo due_date deve estar no formato ISO8601'),
];

const validateTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

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

app.post('/tasks', taskValidationRules, validateTask, (req, res) => {
    const {name, status, due_date} = req.body;
    const taskData = {name, status, due_date};
    db.run('INSERT INTO tasks (name, status, due_date) VALUES (?, ?, ?)', [name, status, due_date], function (err) {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.status(201).json(taskData);
    });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    db.get('SELECT id FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        if (!row) {
            res.status(404).json({error: 'Tarefa não encontrada'});
            return;
        }

        db.run('DELETE FROM tasks WHERE id = ?', taskId, function (err) {
            if (err) {
                res.status(400).json({error: err.message});
                return;
            }
            res.status(204).send();
        });
    });
});

app.put('/tasks/:id', taskValidationRules, validateTask, (req, res) => {
    const taskId = req.params.id;
    const {name, status, due_date} = req.body;
    const updatedTask = {name, status, due_date};

    db.get('SELECT id FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        if (!row) {
            res.status(404).json({error: 'ID inválido.'});
            return;
        }

        db.run(
            'UPDATE tasks SET name = ?, status = ?, due_date = ? WHERE id = ?',
            [name, status, due_date, req.params.id],
            function (err) {
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                res.status(204).json(updatedTask);
            }
        );
    })

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});