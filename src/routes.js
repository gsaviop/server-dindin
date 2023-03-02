const express = require('express');
const { verifyLoggedInUser } = require('./middlewares/authentification');

const routes = express();


routes.post('/usuario');
routes.post('/login');

routes.use(verifyLoggedInUser);

routes.get('/usuario');
routes.post('/usuario');

routes.get('/categoria');

routes.get('/transacao');
routes.get('/transacao/:id');
routes.post('/transacao');
routes.put('/transacao/:id');
routes.delete('/transacao/:id');
routes.get('/transacao/extrato');


module.exports = routes;

