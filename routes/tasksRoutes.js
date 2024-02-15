const express = require('express');
const router = express.Router();
const {taskValidationRules, validateTask} = require('./validators');
const db = require('../db/db');
const {body} = require("express-validator");

router.get('/tasks', (req, res) => {
    const {sort, filter, search} = req.query;

    let sqlCommand = 'SELECT * FROM tasks';

    if (filter) {
        sqlCommand += ` WHERE status = '${filter}'`;
    }

    if (search) {
        if (filter) {
            sqlCommand += ` AND name LIKE '%${search}%'`
        } else {
            sqlCommand += ` WHERE name LIKE '%${search}%'`
        }
    }

    if (sort) {
        sqlCommand += ` ORDER BY ${sort} COLLATE NOCASE`;
    }

    db.all(sqlCommand, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

router.post('/tasks', taskValidationRules, validateTask, (req, res) => {
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

router.delete('/tasks/:id', (req, res) => {
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

router.patch('/tasks/:id', [body('status').isIn(['todo', 'doing', 'ready']).withMessage('O campo status deve ser "todo", "doing" ou "ready"')], validateTask, (req, res) => {
    const taskId = req.params.id;
    const {name, status, due_date} = req.body;
    const updatedTask = {};

    if (name) {
        updatedTask.name = name;
    }
    if (status) {
        updatedTask.status = status;
    }
    if (due_date) {
        updatedTask.due_date = due_date;
    }

    if (Object.keys(updatedTask).length === 0) {
        return res.status(400).json({error: 'Nenhum campo fornecido para atualização.'});
    }

    const fieldsToUpdate = Object.keys(updatedTask).map(field => `${field} = ?`).join(', ');
    const valuesToUpdate = Object.values(updatedTask);

    db.get('SELECT id FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        if (!row) {
            res.status(404).json({error: 'ID inválido.'});
            return;
        }

        const sql = `UPDATE tasks
                     SET ${fieldsToUpdate}
                     WHERE id = ?`;
        const values = [...valuesToUpdate, taskId];

        db.run(sql, values,
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

module.exports = router;