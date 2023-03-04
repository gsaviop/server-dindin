const express = require('express');

const verifyLoggedInUser = require('./middlewares/authentification');

const {
    signUpUser, 
    logInUser,
    checkUserProfile,
    updateUser
} = require('./controllers/users');

const listAllCategories = require('./controllers/categories');

const {
    listUserTransactions,
    checkUserTransactionById,
    registerUserTransaction,
    updateUserTransaction,
    deleteUserTransaction,
    getAllTransactionStatement
} = require('./controllers/transactions');

const routes = express();


routes.post('/usuario', signUpUser);
routes.post('/login', logInUser);

routes.use(verifyLoggedInUser);

routes.get('/usuario', checkUserProfile);
routes.put('/usuario', updateUser);

routes.get('/categoria', listAllCategories);

routes.get('/transacao/extrato', getAllTransactionStatement);
routes.get('/transacao', listUserTransactions);
routes.get('/transacao/:id', checkUserTransactionById);
routes.post('/transacao', registerUserTransaction);
routes.put('/transacao/:id', updateUserTransaction);
routes.delete('/transacao/:id', deleteUserTransaction);


module.exports = routes;

