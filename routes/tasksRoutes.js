const express = require('express');
const router = express.Router();
const {taskValidationRules, validateTask} = require('./validators');
const {body} = require("express-validator");
const Task = require('../models/Task');
const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken);

router.get('/', (req, res) => {
    const {sort, filter, search} = req.query;
    const userId = req.user.userId;

    Task.getAllByUserId(userId, (err, tasks) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        let filteredTasks = tasks;
        if (filter) {
            filteredTasks = tasks.filter(task => task.status === filter);
        }

        if (search) {
            filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (sort) {
            filteredTasks.sort((a, b) => {
                const valueA = typeof a[sort] === 'string' ? a[sort].toLowerCase() : new Date(a[sort]);
                const valueB = typeof b[sort] === 'string' ? b[sort].toLowerCase() : new Date(b[sort]);

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    if (valueA < valueB) return -1;
                    if (valueA > valueB) return 1;
                    return 0;
                } else if (typeof valueA === 'object' && typeof valueB === 'object') {
                    return valueA.getTime() - valueB.getTime();
                } else {
                    return typeof valueA === 'string' ? -1 : 1;
                }
            });
        }

        res.json(filteredTasks);
    });
});

router.post('/', taskValidationRules, validateTask, (req, res) => {
    const {name, status, due_date} = req.body;
    const userId = req.user.userId;

    Task.create(userId, name, status, due_date, (err, newTask) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.status(201).json(newTask);
    });
});

router.delete('/:id', (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.userId;

    Task.getById(userId, taskId, (err, task) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        if (!task) {
            res.status(404).json({error: 'Task not found'});
            return;
        }

        if (task.user_id !== userId) {
            res.status(403).json({error: 'You do not have permission to delete this task'});
            return;
        }

        Task.deleteById(userId, taskId, (err, task) => {
            if (err) {
                res.status(400).json({error: err.message});
                return;
            }

            res.status(204).send();
        });
    });


});

router.patch('/:id', [body('status').isIn(['todo', 'doing', 'ready']).withMessage('The status field must be "todo", "doing" or "ready"')], validateTask, (req, res) => {
    const taskId = req.params.id;
    const {name, status, due_date} = req.body;
    const userId = req.user.userId;

    const updatedTask = {};
    if (name) updatedTask.name = name;
    if (status) updatedTask.status = status;
    if (due_date) updatedTask.due_date = due_date;

    if (Object.keys(updatedTask).length === 0) {
        return res.status(400).json({error: 'No fields provided for update.'});
    }

    Task.getById(userId, taskId, (err, task) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        if (!task) {
            res.status(404).json({error: 'Task not found'});
            return;
        }

        if (task.user_id !== userId) {
            res.status(403).json({error: 'You do not have permission to edit this task'});
            return;
        }

        Task.updateById(userId, taskId, updatedTask, (err) => {
            if (err) {
                res.status(400).json({error: err.message});
                return;
            }
            res.status(204).json(updatedTask);
        });
    })

});


module.exports = router;