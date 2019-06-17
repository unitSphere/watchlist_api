const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const stocksRouter = express.Router();
const fetch = require("node-fetch");
const calculate = require('../returns.js');

stocksRouter.get('/:name', (req, res) => {
    function get_full_info_by_symbol(symbol, full_list){
        let result = -1;
        for(let i = 0; i < full_list.length; i++){
            if(symbol.toString() === full_list[i].ticker.toString()){
                result = full_list[i];
                return result;
            }
        }
        return result;
    }

    async function fetchReturns(country, stock_symbol, date){
        let result = await calculate.getReturns(country, stock_symbol, date);
        result = await Promise.resolve(result);
        let full_info = get_full_info_by_symbol(result.symbol, test_data.table);
        result.stock_name = full_info.stock_name;
        res.render('stocks', {result: JSON.stringify(result)});
    }
    fetchReturns('hk', req.params.name, '');
});

stocksRouter.get('/add/:name', (req, res) => {
    function get_full_info_by_symbol(symbol, full_list){
        let result = -1;
        for(let i = 0; i < full_list.length; i++){
            if(symbol.toString() === full_list[i].ticker.toString()){
                result = full_list[i];
                return result;
            }
        }
        return result;
    }
    async function fetchReturns(country, stock_symbol, date){
        let result = await calculate.getReturns(country, stock_symbol, date);
        result = await Promise.resolve(result);
        let full_info = get_full_info_by_symbol(result.symbol, test_data.table);
        result.stock_name = full_info.stock_name;
        res.json(result);
    }
    fetchReturns('hk', req.params.name, '');
});



module.exports = stocksRouter;