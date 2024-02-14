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
            due_date DATE
        )
    `);

    // db.run("INSERT INTO tasks (name, status, due_date) VALUES ('Tarefa 1', 'To Do', '2024-02-14')");
    // db.run("INSERT INTO tasks (name, status, due_date) VALUES ('Tarefa 2', 'Doing', '2024-02-15')");
    // db.run("INSERT INTO tasks (name, status, due_date) VALUES ('Tarefa 3', 'Ready', '2024-02-16')");
});

module.exports = db;