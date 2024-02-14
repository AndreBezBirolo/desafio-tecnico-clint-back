const {body, validationResult} = require('express-validator');

const taskValidationRules = [
    body('name').notEmpty().withMessage('O campo nome é obrigatório'),
    body('status').isIn(['To do', 'Doing', 'Ready']).withMessage('O campo status deve ser "To Do", "Doing" ou "Ready"'),
    body('due_date').isISO8601().toDate().withMessage('O campo due_date deve estar no formato ISO8601'),
];

const validateTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

module.exports = {taskValidationRules, validateTask};