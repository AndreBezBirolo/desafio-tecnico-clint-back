const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db/db');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor do Kanban está rodando!');
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});