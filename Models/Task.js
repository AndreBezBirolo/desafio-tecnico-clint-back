const db = require('../db/db');

const Task = {
    getAllByUserId: (userId, callback) => {
        db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], callback);
    },

    getById: (userId, taskId, callback) => {
        db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], callback);
    },

    create: (userId, name, status, due_date, callback) => {
        db.run('INSERT INTO tasks (user_id, name, status, due_date) VALUES (?, ?, ?, ?)', [userId, name, status, due_date], function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, {id: this.lastID, name, status, due_date});
        });
    },

    deleteById: (userId, taskId, callback) => {
        db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], callback);
    },

    updateById: (userId, taskId, updatedTask, callback) => {
        const {name, status, due_date} = updatedTask;

        const fieldsToUpdate = Object.keys(updatedTask).map(field => `${field} = ?`).join(', ');
        const valuesToUpdate = Object.values(updatedTask);

        const sql = `UPDATE tasks
                     SET ${fieldsToUpdate}
                     WHERE id = ?
                       AND user_id = ?`;
        const values = [...valuesToUpdate, taskId, userId];

        db.run(sql, values, function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, updatedTask);
        });
    }
};

module.exports = Task;