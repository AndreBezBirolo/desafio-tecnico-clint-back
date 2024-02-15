const db = require('../db/db');

const User = {
    create: (username, password, callback) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], callback);
    },

    findByUsername: (username, callback) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], callback);
    },

};

module.exports = User;