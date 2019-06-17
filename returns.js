const fetch = require('node-fetch');
module.exports = {

    getReturns: function getReturns(country, stock_symbol, date) {

function convertDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    let year = date.getFullYear();
    let result = year + '-' + month + '-' + day;
    return result;
}



function getFiveYear(date){
    return ['2019-05-31', '2014-05-30'];
}

function getThreeYear(date){
    return ['2019-05-31', '2016-05-31'];
}

function getOneYear(date){
    return ['2019-05-31', '2018-05-31'];
}

function getYTD(date){
    return ['2019-05-31', '2019-01-02'];
}

function getOneMonth(date){
    return ['2019-05-31', '2019-04-30'];
}

function getOneWeek(date){
    return ['2019-05-31', '2019-05-24'];
}

function getOneDay(date){
    return ['2019-05-31', '2019-05-30'];
}

async function getData(country, symbol, start_date, end_date){
    let url = 'http://api.invbots.com/data/v1/stock/' + country + '/' + symbol + '/price?start_date=' + start_date + '&end_date=' + end_date;
    let data = await fetch(url);
    result = await data.json();
    return result;
}

async function calcReturns(stock_symbol, date){
    let day = getOneDay(date);
    let week = getOneWeek(date);
    let month = getOneMonth(date);
    let ytd = getYTD(date);
    let year = getOneYear(date);
    let three_year = getThreeYear(date);
    let five_year = getFiveYear(date);

    let get_day = await getData(country, stock_symbol, day[1], day[0]);
    let get_week = await getData(country, stock_symbol, week[1], week[0]);
    let get_month = await getData(country, stock_symbol, month[1], month[0]);
    let get_ytd = await getData(country, stock_symbol, ytd[1], ytd[0]);
    let get_year = await getData(country, stock_symbol, year[1], year[0]);
    let get_three_year = await getData(country, stock_symbol, three_year[1], three_year[0]);
    let get_five_year = await getData(country, stock_symbol, five_year[1], five_year[0]);

    let price, result_day, result_week, result_month, result_ytd, result_year, result_three_year, result_five_year, last_update;
    last_update = day[0];
    if(get_day.length > 0) {
        price = get_day[0].close;
        result_day = ((get_day[0].close / get_day[get_day.length - 1].close) - 1) * 100;
    }
    if(get_week.length > 0) {
        result_week = ((get_week[0].close / get_week[get_week.length - 1].close) - 1) * 100;
    }
    if(get_month.length > 0) {
        result_month = ((get_month[0].close / get_month[get_month.length - 1].close) - 1) * 100;
    }
    if(get_year.length > 0) {
        result_year = ((get_year[0].close / get_year[get_year.length - 1].close) - 1) * 100;
    }
    if(get_ytd.length > 0) {
        result_ytd = ((get_ytd[0].close / get_ytd[get_ytd.length - 1].close) - 1) * 100;
    }
    if(get_three_year.length > 0) {
        result_three_year = ((get_three_year[0].close / get_three_year[get_three_year.length - 1].close) - 1) * 100;
    }
    if(get_five_year.length > 0) {
        result_five_year = ((get_five_year[0].close / get_five_year[get_five_year.length - 1].close) - 1) * 100;
    }

    let result = {market: country, symbol: stock_symbol, price: price, day_return: result_day, week_return: result_week, month_return: result_month, ytd_return: result_ytd, year_return: result_year, three_year_return: result_three_year, five_year_return: result_five_year, last_update: last_update};
    return result;
}
        return calcReturns(stock_symbol, date);
    }
};