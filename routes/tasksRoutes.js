const express = require('express');
const router = express.Router();
const {taskValidationRules, validateTask} = require('./validators');
const db = require('../db/db');
const {body} = require("express-validator");
const Task = require('../models/Task');

router.get('/tasks', (req, res) => {
    const {sort, filter, search} = req.query;

    Task.getAll((err, tasks) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        let filteredTasks = tasks;
        if (filter) {
            filteredTasks = tasks.filter(task => task.status === filter);
        }

        if (search) {
            filteredTasks = filteredTasks.filter(task => task.name.includes(search));
        }

        if (sort) {
            filteredTasks.sort((a, b) => {
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0;
            });
        }

        res.json(filteredTasks);
    });
});

router.post('/tasks', taskValidationRules, validateTask, (req, res) => {
    const {name, status, due_date} = req.body;

    Task.create(name, status, due_date, (err, newTask) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.status(201).json(newTask);
    });
});

router.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    Task.deleteById(taskId, (err) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.status(204).send();
    });
});

router.patch('/tasks/:id', [body('status').isIn(['todo', 'doing', 'ready']).withMessage('The status field must be "todo", "doing" or "ready"')], validateTask, (req, res) => {
    const taskId = req.params.id;
    const {name, status, due_date} = req.body;

    const updatedTask = {};
    if (name) updatedTask.name = name;
    if (status) updatedTask.status = status;
    if (due_date) updatedTask.due_date = due_date;

    if (Object.keys(updatedTask).length === 0) {
        return res.status(400).json({error: 'No fields provided for update.'});
    }

    Task.updateById(taskId, updatedTask, (err) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.status(204).json(updatedTask);
    });
});


module.exports = router;