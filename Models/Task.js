const db = require('../db/db');

const Task = {
    getAll: (callback) => {
        db.all('SELECT * FROM tasks', callback);
    },

    create: (name, status, due_date, callback) => {
        db.run('INSERT INTO tasks (name, status, due_date) VALUES (?, ?, ?)', [name, status, due_date], function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, {id: this.lastID, name, status, due_date});
        });
    },

    deleteById: (id, callback) => {
        db.run('DELETE FROM tasks WHERE id = ?', [id], callback);
    },

    updateById: (id, updatedTask, callback) => {
        const {name, status, due_date} = updatedTask;

        const fieldsToUpdate = Object.keys(updatedTask).map(field => `${field} = ?`).join(', ');
        const valuesToUpdate = Object.values(updatedTask);

        const sql = `UPDATE tasks
                     SET ${fieldsToUpdate}
                     WHERE id = ?`;
        const values = [...valuesToUpdate, id];

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