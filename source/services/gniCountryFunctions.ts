import { connection } from './database'

export function insertGniCountry(data: any, isXml: boolean, res: any){
    //adds new column for the specified year in the body of the put request
    connection.query(querySelectorInsert1(isXml, data), function (err: any, result: any) {
        if (err){
            throwErrors(res, err)
        } else {
            console.log('column created')
            //insert the new country and gni value sent in the body of the put request
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
    return false
}

export function insertNewGniCountryColumn(year: any, res: any){
    let sql = `ALTER TABLE gnibycountry ADD COLUMN ${'Y' + year} Varchar(255) AFTER ${'Y' + (year - 1)};`
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
            return `ALTER TABLE gnibycountry ADD COLUMN ${'Y' + data.data.year[0]} Varchar(255) AFTER ${'Y' + (data.data.year[0] - 1)};`

        case false:
            return `ALTER TABLE gnibycountry ADD COLUMN ${'Y' + data.year} Varchar(255) AFTER ${'Y' + (data.year - 1)};`
    }
}

function querySelectorInsert2(isXml: boolean, data: any){

    switch (isXml) {
        case true:
            return `Insert INTO gnibycountry (Country, '${'Y' + data.data.year[0]}') values ('${data.data.country[0]}', ${data.data.value[0]});`

        case false:
            return `Insert INTO gnibycountry (Country, '${'Y' + data.year}') values ('${data.country}', ${data.value});`
    }
}

export function deleteGniCountry(id: string, res:any){
    try{
        let sql = `DELETE FROM gnibycountry WHERE Country = '${id}'`;
        connection.query(sql, function (err:any, result:any) {
            console.log(result)
            if (err){
                throwErrors(res, err)
            } else {
                if(result.affectedRows > 0){
                    res.status(200).json({'status': '200', 'message': 'OK'})
                } else {
                    res.status(400).json({'status': '400', 'message': 'Bad Request: no rows affected'})
                }
            }
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
}

export function updateGniCountry(data: any, isXml: boolean, res:any){
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
            return`UPDATE gnibycountry SET Country = '${data.data.country[0]}', ${'Y' + data.data.year[0]} = '${data.data.value[0]}' WHERE Country = '${data.data.country[0]}';`;

        case false:
            return`UPDATE gnibycountry SET Country = '${data.country}', ${'Y' + data.year} = '${data.value}' WHERE Country = '${data.country}';`;
    }
}


export function getGniCountryAll(res: any, type: string){
    let sql = `SELECT * FROM gnibycountry WHERE 1`;
    try{
        connection.query(sql, function (err:any, result:any, fields:any) {
            if (err){
                throwErrors(res, err)
            }
            if(type === "application/xml"){
                let restructuredResult = restructureJson(result)
                console.log('IN CONVERTER')
                var convert = require('xml-js');
                var options = {compact: true, ignoreComment: true, spaces: 4};

                var result1 = convert.json2xml(restructuredResult, options);
                //OBJtoXMLJoel(restructuredResult);
                //let testString = '<root> blabla bla </root><root><otherTag>test here 2</otherTag></root><root><Root></Root></root>'
                let refactoredXml = removeUnwantedRootElements(result1)
                //result1 = "<root>" + result1 + "</root>";
                //console.log(restructuredResult.root.length)
                //let resultNew = OBJtoXML(restructuredResult)
                //console.log(resultNew)
                //console.log(result1)
                // result = OBJtoXML(result);
                //resultNew = "<root>" + resultNew + "</root>";
                console.log('testing converter back now');

                // let jsonRes = parseXmlToJson(resultNew)
                // console.log(jsonRes)

                //console.log("num of keys::: ", Object.keys(jsonRes).length)

                var result2 = convert.xml2json(refactoredXml, {compact: true, spaces: 4});
                console.log(result2)
                // var options2 = {ignoreComment: true, alwaysChildren: true};
                // var result2 = convert.xml2json(refactoredXml, options2);
                // console.log(result2)

                // var convert = require('xml-js');
                // var result1 = convert.xml2json(result, {compact: true, spaces: 4});
                // //let convBackRes = xml2json(result)
                // console.log('Convert back result is as follows: ', result1)
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
    }
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

// function OBJtoXMLJoel(obj: any){
//     let xmlReturnString = "";
//     console.log("obj root 0", Object.keys(obj.root[0]))
//     let key = Object.keys(obj.root[0])
//     let keyCountryName = Object.keys(obj.root[1])
//     console.log("key countryName 1: ", keyCountryName[0])
//     let keyForValue = Object.keys(obj.root[0][`${key}`][0])
//     console.log("obj root 0 value 0 object", obj.root[0][`${key}`][0])
//     console.log("obj root 0 value 0 keys array", Object.keys(obj.root[0][`${key}`][0]))
//     console.log("obj root 0 value 0 key", Object.keys(obj.root[0][`${key}`][0]))
//     console.log("obj root 0 value 0 value", obj.root[0][`${key}`][0][`${keyForValue}`])
//     // for(let i = 0; i < obj.root.length; i++){
//     //     let key = Object.keys(obj.root[i])
//     //     xmlReturnString += "<" + key + ">";
//     //
//     // }
// }

function removeUnwantedRootElements(xmlString: string){
    let stringNoRootStart = xmlString.replace(/<root>/g, '');
    let stringNoRootEnd = stringNoRootStart.replace(/<\/root>/g, '');
    return "<root>" + stringNoRootEnd + "</root>"
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

function parseXmlToJson(xml: string) {
    const json:any = {};
    for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
        const key = res[1] || res[3];
        const value = res[2] && parseXmlToJson(res[2]);
        json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;
    }
    return json;
}

function returnNullIfUndefined(input:any){
    return (input ? input : `NULL`);
}

function throwErrors(res: any, error: any){
    console.log(error)
    return res.status(400).json({'status': '400', 'message': error})
}
