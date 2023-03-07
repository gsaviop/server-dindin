const express = require('express');
const routes = require('./src/routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3343, () =>
  console.log(`Server listening at http://localhost:3343`)
);