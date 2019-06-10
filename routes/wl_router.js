const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');

const watchlistsRouter = express.Router();

watchlistsRouter.get('/', (req, res) => {
    res.render('watchlists');
});

module.exports = watchlistsRouter;