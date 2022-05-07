import { connection } from './database'
import convert from "xml-js";

export function insertSRate(data: any, isXml: boolean, res: any){
    try{
        connection.query(querySelecter(isXml, data), function (err: any, result: any) {
            if (err){
                console.log(err)
                return throwErrors(res, err)
            }
            console.log("1 record inserted");
            return res.status(200).json({'status': '200', 'message': 'OK'})
        });
    } catch (e) {
        console.log(e)
        return throwErrors(res, e)
    }
}

function querySelecter(isXml: boolean, data: any){
    switch (isXml) {
        case true:
            return `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('${data.data.country[0]}',${data.data.year[0]},'${returnNullIfUndefined(data.data.sex[0])}','${returnNullIfUndefined(data.data.age[0])}',${data.data.suicide_no[0]},${returnNullIfUndefined(data.data.population[0])},${returnNullIfUndefined(data.data.suicides100k_pop[0])},'${returnNullIfUndefined(data.data.countryyear[0])}',NULL,NULL,NULL);`

        case false:
            return `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('${data.country}',${data.year},'${returnNullIfUndefined(data.sex)}','${returnNullIfUndefined(data.age)}',${data.suicide_no},${returnNullIfUndefined(data.population)},${returnNullIfUndefined(data.suicides100k_pop)},'${returnNullIfUndefined(data.countryyear)}',NULL,NULL,NULL);`
    }
}

export function deleteSRate(id: string, res:any){
    try{
        let sql = `DELETE FROM suiciderates WHERE country = '${id}'`;
        connection.query(sql, function (err:any, result:any) {
            if (err){
                throwErrors(res, err)
            }
            if(result.affectedRows > 0){
                return res.status(200).json({'status': '200', 'message': 'OK'})
            }
            return res.status(400).json({'status': '400', 'message': 'Bad Request: no rows affected'})
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
}

export function updateSRate(id:any, data: any, isXml: boolean, res:any){
    try{
        connection.query(updateQuerySelector(id, isXml, data), function (err:any, result:any) {
            if (err){
                throwErrors(res, err)
            }
            return res.status(200).json({'status': '200', 'message': 'OK'})
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
}

function updateQuerySelector(id:any, isXml: boolean, data: any){
    switch (isXml) {
        case true:
            return`UPDATE suiciderates SET country = '${data.data.country[0]}',year = ${data.data.year[0]},suicides_no = ${data.data.suicide_no[0]},countryyear = '${data.data.country[0]}${data.data.year[0]}' WHERE id = ${id};`;

        case false:
            return`UPDATE suiciderates SET country = '${data.country}',year = ${data.year},suicides_no = ${data.suicide_no},countryyear = '${data.country}${data.year}' WHERE id = ${id};`;
    }
}

export function getSRateRange(res: any, start: string, end: string, type: string){
    let sql = `SELECT * FROM suiciderates WHERE id >= ${start} AND id <= ${end}`;
    try{
        connection.query(sql, function (err: any, result: any) {
            if (err){
                throwErrors(res, err)
            }
            if(type === "xml"){
                console.log('IN CONVERTER')
                result = OBJtoXML(result);
                res.set('Content-Type', 'application/xml');
                return res.status(200).send(result)
            }
            if(type === "json") {
                return res.status(200).json({result})
            }
            return throwErrors(res, 'Not recognized key value');
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
}

export function getSRateCountry(res: any, id: any, isXml: boolean){
    let sql = `SELECT country, year, SUM(suicides_no) AS sRateSum FROM suiciderates WHERE country = '${id}' AND year >= 1990 AND year <= 2014 GROUP BY year`;
    try{
        connection.query(sql, function (err: any, result: any) {
            if (err){
                throwErrors(res, err)
            } else {
                if(isXml)
                {
                    //change to xml data
                    let restructuredResult = restructureJson(result)
                    var convert = require('xml-js');
                    var options = {compact: true, ignoreComment: true, spaces: 4};
                    var result1 = convert.json2xml(restructuredResult, options);
                    let refactoredXml = removeUnwantedRootElements(result1);
                    res.set('Content-Type', 'application/xml');
                    return res.status(200).send(refactoredXml)
                } else {
                    return res.status(200).json({result})
                }
            }
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
}

function OBJtoXML(obj: any) {
    var xml = '';
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += OBJtoXML(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
}

function returnNullIfUndefined(input:any){
    return (input ? input : `NULL`);
}

function throwErrors(res: any, error: any){
    return res.status(400).json({'status': '400', 'message': error})
}

function restructureJson(jsonObj: any){
    let jsonReturnObjString = '{"root":[]}';
    let jsonReturnObj = JSON.parse(jsonReturnObjString)
    const keys = Object.keys(jsonObj);
    keys.forEach((key, index) => {
        const propOwn = Object.getOwnPropertyNames(jsonObj[key]); //array with keys that we need to get the values from jsonObj[key].
        let countryName = jsonObj[key][`${propOwn[0]}`]; //gets the country name from the database data
        let pushObjString = '{"' + countryName + '": []}';
        let pushObjJSONParsed = JSON.parse(pushObjString);
        //loop through all data points and make a json string that holds the year as key and the gni value as value to push onto the country object
        for(let i = 1; i < propOwn.length; i++)
        {
            let yearValueObjectString = '{"' + propOwn[i] + '": ' + jsonObj[key][`${propOwn[i]}`] + '}';
            let yearValueJSON = JSON.parse(yearValueObjectString);
            pushObjJSONParsed[`${countryName}`].push(yearValueJSON);
        }
        // push the finished country with the array of year and gni value pairs onto the root data json
        jsonReturnObj.root.push(pushObjJSONParsed);
    });
    //return restructured json object. uncomment log to see what it looks like
    //console.log("return obj parsed AFTER ADDED:::: ", jsonReturnObj)
    return jsonReturnObj;
}

function removeUnwantedRootElements(xmlString: string){
    let stringNoRootStart = xmlString.replace(/<root>/g, '');
    let stringNoRootEnd = stringNoRootStart.replace(/<\/root>/g, '');
    return "<root>" + stringNoRootEnd + "</root>"
}