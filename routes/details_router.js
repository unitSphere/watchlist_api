const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const fs = require('fs');
const test_data_json = fs.readFileSync('./data/test.json', 'utf-8');
global.test_data = JSON.parse(test_data_json);
const fuzz = require('fuzzball');

const detailsRouter = express.Router();
detailsRouter.use(bodyParser.json());

detailsRouter.get('/:name', (req, res) => {
    if(req.params.name) {
        Watchlist.find({"name": req.params.name}, (err, result) => {
            if (err) return res.status(500).json({message: 'Error occurred while searching the database'});
            else {
                if (result[0]) {
                    return res.render('details', {result: JSON.stringify(result[0])});
                } else {
                    res.json({});
                }
            }
        });
    }
    else{
        res.status(204).json({});
    }
});

detailsRouter.put('/:name', (req, res) =>{
    Watchlist.update({"name": req.params.name}, {assets: req.body}, { multi: false }, (err, result) => {
        if(err) return res.status(500).json({message: 'Update failed'});
        else {
            return res.status(200).json('Successfully updated');
        }
    })
});

detailsRouter.get('/search/:input', (req, res) => {
    console.log(req.params.input);
    let input = req.params.input;
    function get_stock_names (arr){
        let new_arr = [];
        for(let i = 0; i < arr.length; i++){
            new_arr.push(arr[i].stock_name);
        }
        return new_arr;
    }

    function get_tickers (arr){
        let new_arr = [];
        for(let i = 0; i < arr.length; i++){
            new_arr.push(arr[i].ticker.toString());
        }
        return new_arr;
    }


    function get_full_info_by_name(find_them, full_list){
        let new_arr = [];
        for(let i=0; i<find_them.length; i++){
            for(let j=0; j<full_list.length; j++){
                if(find_them[i].choice === full_list[j].stock_name){
                    new_arr.push(full_list[j]);
                }
            }
        }
        return new_arr;
    }

    function get_full_info_by_ticker(find_them, full_list){
        let new_arr = [];
        for(let i=0; i<find_them.length; i++){
            for(let j=0; j<full_list.length; j++){
                if(find_them[i].choice === full_list[j].ticker.toString()){
                    new_arr.push(full_list[j]);
                }
            }
        }
        return new_arr;
    }

    if(isNaN(input)) {
        let options = {scorer: fuzz.partial_ratio, returnObjects: true};
        let choices = get_stock_names(test_data.table);
        let result = fuzz.extract(input, choices, options);
        let first_match_array = [];
        let sub_match_array = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i].score > 75) {
                if (result[i].choice.toLowerCase().indexOf(input.toLowerCase()) === 0) {
                    first_match_array.push(result[i]);
                } else {
                    sub_match_array.push(result[i]);
                }
            }
        }
        let best_match_array = first_match_array.concat(sub_match_array);

        console.log(best_match_array);
        let stock_names = best_match_array.slice(0, 10);
        let final = get_full_info_by_name(stock_names, test_data.table);
        // console.log(final);
        res.status(200).json({sorted: final});
    }
    else{
        let options = {scorer: fuzz.partial_ratio, returnObjects: true};
        let choices = get_tickers(test_data.table);
        let result = fuzz.extract(input, choices, options);
        let first_match_array = [];
        let sub_match_array = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i].score > 99) {
                if (result[i].choice.toLowerCase().indexOf(input.toLowerCase()) === 0) {
                    first_match_array.push(result[i]);
                } else {
                    sub_match_array.push(result[i]);
                }
            }
        }
        let best_match_array = first_match_array.concat(sub_match_array);

        // console.log(best_match_array);
        let tickers = best_match_array.slice(0, 10);
        console.log(tickers);
        let final = get_full_info_by_ticker(tickers, test_data.table);
        console.log(final);
        res.status(200).json({sorted: final});
    }
});

module.exports = detailsRouter;