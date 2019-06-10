//Watchlists API Server File
//Created by: Rustami Ubaydullo

const express = require('express');
const app = express();
const pug = require('pug');
const watchlistsRouter = require('./routes/wl_router.js');

app.use('/watchlists', watchlistsRouter);

app.set('view engine', 'pug');

//Database SETUP --------------------------

const mongoose = require('mongoose');
mongoose.connect('mongodb://urustam510:rrustam510@cluster0-shard-00-00-ehwsx.mongodb.net:27017,cluster0-shard-00-01-ehwsx.mongodb.net:27017,cluster0-shard-00-02-ehwsx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
const db = mongoose.connection;
app.use(express.static("public"));

// Upon connection failure
db.on('error', console.error.bind(console,
    'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...");
});

global.WatchlistSchema = mongoose.Schema({
    watchlist_name: {type: String, required: true, unique: true},
    assets: {type: Array}
});

global.Watchlist = mongoose.model('Watchlist', WatchlistSchema);

//-----------------------------------------

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});