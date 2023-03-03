const express = require('express');

const { verifyLoggedInUser } = require('./middlewares/authentification');

const {
    signUpUser, 
    logInUser,
    checkUserProfile
} = require('./controllers/users');

const routes = express();


routes.post('/usuario', signUpUser);
routes.post('/login', logInUser);

routes.use(verifyLoggedInUser);

routes.get('/usuario', checkUserProfile);
routes.put('/usuario');

routes.get('/categoria');

routes.get('/transacao');
routes.get('/transacao/:id');
routes.post('/transacao');
routes.put('/transacao/:id');
routes.delete('/transacao/:id');
routes.get('/transacao/extrato');


module.exports = routes;

