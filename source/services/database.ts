import {NextFunction, Request, Response} from "express";
import axios, {AxiosResponse} from "axios";

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'joel_api'
})

const insertSuicideRate = () => {
    // let sql = `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('Albania',1986,'male','infinite years',21,312900,6.71,'Albania1986',NULL,796,'Generation Q');`
    // connection.connect(function(err: any) {
    //     if (err) throw err;
    //     console.log("Connected!");
    //     connection.query(sql, function (err: any, result: any) {
    //         if (err) throw err;
    //         console.log("1 record inserted");
    //     });
    //     connection.end();
    // });
    console.log(123)
};


export default { insertSuicideRate };