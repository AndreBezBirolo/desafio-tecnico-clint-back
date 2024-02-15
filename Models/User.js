const db = require('../db/db');

const User = {
    findByUsername: (username, callback) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    },

    create: (username, password, callback) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, this.lastID);
        });
    }
};

module.exports = User;