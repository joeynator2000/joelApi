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
            throwErrors(res, 'Not recognized key value');
        });
    }catch (e) {
        console.log(e)
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
    console.log(error)
    return res.status(400).json({'status': '400', 'message': error})
}