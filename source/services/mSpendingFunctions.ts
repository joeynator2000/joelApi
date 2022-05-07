import { connection } from './database'
import convert from "xml-js";

export function insertMSpending(data: any, isXml: boolean, res: any){
    try
    {
        connection.query(querySelectorInsert1(isXml, data), function (err: any, result: any) {
            if (err){
                throwErrors(res, err)
            } else {
                console.log('column created')
                connection.query(querySelectorInsert2(isXml, data), function (err: any, result: any) {
                    if (err){
                        throwErrors(res, err)
                    } else {
                        console.log('data inserted')
                        res.status(200).json({'message': 'New year entered and country recorded'})
                    }
                });
            }
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, "An error has occurred")
    }
}

export function insertNewMSpendingColumn(year: any, res: any){
    let sql = `ALTER TABLE militaryexpenditure ADD COLUMN ${'Y' + year} decimal(17,6) AFTER ${'Y' + (year - 1)};`
    connection.query(sql, function (err: any, result: any) {
        if (err){
            throwErrors(res, err)
        } else {
            console.log('Column added')
            res.status(200).json({'message': 'New year entered'})
        }
    });
}

function querySelectorInsert1(isXml: boolean, data: any){

    switch (isXml) {
        case true:
            return `ALTER TABLE militaryexpenditure ADD COLUMN ${'Y' + data.data.year[0]} decimal(17,6) AFTER ${'Y' + (data.data.year[0] - 1)};`

        case false:
            return `ALTER TABLE militaryexpenditure ADD COLUMN ${'Y' + data.year} decimal(17,6) AFTER ${'Y' + (data.year - 1)};`
    }
}

function querySelectorInsert2(isXml: boolean, data: any){

    switch (isXml) {
        case true:
            return `Insert INTO militaryexpenditure (name, ${'Y' + data.data.year[0]}) values ('${data.data.country[0]}', ${data.data.value[0]});`

        case false:
            return `Insert INTO militaryexpenditure (name, ${'Y' + data.year}) values ('${data.country}', ${data.value});`
    }
}

export function deleteMSpending(id: string, res:any){
    try{
        let sql = `DELETE FROM militaryexpenditure WHERE Name LIKE '${id}'`;
        connection.query(sql, function (err:any, result:any) {
            //console.log(result.affectedRows)
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

export function updateMSpending(data: any, isXml: boolean, res:any){
    console.log(data)
    console.log(updateQuerySelector(isXml, data))

    connection.query(updateQuerySelector(isXml, data), function (err:any, result:any) {
        if (err){
            throwErrors(res, err)
        } else {
            console.log(result.affectedRows)
            if(result.affectedRows > 0){
                res.status(200).json({'status': '200', 'message': 'OK'})
            } else {
                throwErrors(res, 'No rows affected')
            }
        }
    });
}

function updateQuerySelector(isXml: boolean, data: any){
    switch (isXml) {
        case true:
            return`UPDATE militaryexpenditure SET name = '${data.data.country[0]}', ${'Y' + data.data.year[0]} = ${data.data.value[0]} WHERE Name = '${data.data.country}';`;

        case false:
            return`UPDATE militaryexpenditure SET name = '${data.country}', ${'Y' + data.year} = ${data.value} WHERE Name = '${data.country}';`;
    }
}

export function getMSpendingAll(res: any, type: string){
    let sql = `SELECT * FROM militaryexpenditure WHERE 1`;
    try{
        connection.query(sql, function (err: any, result: any) {
            if (err){
                throwErrors(res, err)
            }
            if(type === "application/xml"){
                let restructuredResult = restructureJson(result)
                var convert = require('xml-js');
                var options = {compact: true, ignoreComment: true, spaces: 4};
                var result1 = convert.json2xml(restructuredResult, options);
                let refactoredXml = removeUnwantedRootElements(result1);
                res.set('Content-Type', 'application/xml');
                return res.status(200).send(refactoredXml)
            }
            if(type === "application/json") {
                return res.status(200).json({result})
            }
            throwErrors(res, 'Not recognized key value');
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, "An error occurred while fetching or sending the data")
    }
}

function throwErrors(res: any, error: any){
    console.log(error)
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