import {NextFunction, Request, Response} from "express";
import axios, {AxiosResponse} from "axios";

const mysql = require('mysql')
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'joel_api'
})