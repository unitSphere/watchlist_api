const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');

const watchlistsRouter = express.Router();

watchlistsRouter.get('/', (req, res) => {
    res.render('watchlists');
});

watchlistsRouter.get('/all', (req, res) => {
    Watchlist.find((err, result) => {
        // Note that this error doesn't mean nothing was found,
        if (err) {
            return res.status(500).send(err) ;}
        // send the list of all watchlists
        else {
            return res.status(200).json(result);
        }
    });
});

watchlistsRouter.get('/:name', (req, res) => {
    Watchlist.find({"name": req.params.name}, (err, result) => {
        if(err) return res.status(500).json({message: 'Error occurred while searching the database'});
        res.json(result[0]);
    })
});

watchlistsRouter.post('/:name', (req, res) => {
    console.log('ss');
    let new_watchlist = {
        name: req.params.name,
        assets: []
    };

    if(req.params.name){
        let data = new Watchlist(new_watchlist);
        data.save((err) => {
        if(err) {return res.json("Problem occurred while inserting new data");}
        else {
            return res.json("An empty Watchlist was created");
        }
    });
    }
    else{
        return res.status(400).json("Problem occurred while inserting new data. Request problem");
    }
});

watchlistsRouter.delete('/:name', (req, res) => {
    let response = Watchlist.remove({"name" : req.params.name}, (err) => {
            if (err) {
                res.status(500).json({message: "Problem occurred while deleting"});
            } else {
                res.status(200).json(`One watchlist deleted`);
            }
        }
    );
});

watchlistsRouter.delete('/', (req, res) => {
    let response = Watchlist.remove({}, (err) => {
            if (err) {
                res.status(500).json("Problem occurred while deleting");
            } else {
                res.status(200).json("Everything deleted");
            }
        }
    );

});

module.exports = watchlistsRouter;