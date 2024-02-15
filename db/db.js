const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/kanban.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados SQLite');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks
        (
            id       INTEGER PRIMARY KEY,
            name     TEXT NOT NULL,
            status   TEXT NOT NULL,
            due_date DATE,
            user_id  INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users
        (
            id       INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`
    );

});

module.exports = db;