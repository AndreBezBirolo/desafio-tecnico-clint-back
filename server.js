const express = require('express');
const {ValidationError} = require('express-validator');
const app = express();
const PORT = 3000;
const tasksRoutes = require('./routes/tasksRoutes');


const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof ValidationError) {
        return res.status(400).json({errors: err.array()});
    }

    res.status(500).json({error: 'Ocorreu um erro interno no servidor'});
};

app.use(errorHandler);
app.use(express.json());
app.use('/tasks', tasksRoutes);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});