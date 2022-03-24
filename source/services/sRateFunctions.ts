import { connection } from './database'

export function insertSRate(data: any, isXml: boolean, res: any){
    try{
        connection.query(querySelecter(isXml, data), function (err: any, result: any) {
            if (err){
                console.log(err)
                throwErrors(res, err)
            }
            console.log("1 record inserted");
        });
        return res.status(200).json({'status': '200', 'message': 'OK'})
    } catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
}

function querySelecter(isXml: boolean, data: any){
    switch (isXml) {
        case true:
            return `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('${data.data.country[0]}',${data.data.year[0]},'${returnNullIfUndefined(data.data.sex[0])}','${returnNullIfUndefined(data.data.age[0])}',${data.data.suicide_no[0]},${data.data.population[0]},${returnNullIfUndefined(data.data.suicides100k_pop[0])},'${returnNullIfUndefined(data.data.countryyear[0])}',NULL,NULL,NULL);`

        case false:
            return `INSERT INTO suiciderates(country,year,sex,age,suicides_no,population,suicides100k_pop,countryyear,HDI_for_year,gdp_per_capita_,generation) VALUES ('${data.country}',${data.year},'${returnNullIfUndefined(data.sex)}','${returnNullIfUndefined(data.age)}',${data.suicide_no},${data.population},${returnNullIfUndefined(data.suicides100k_pop)},'${returnNullIfUndefined(data.countryyear)}',NULL,NULL,NULL);`
    }
}

export function deleteSRate(id: string, res:any){
    try{
        let sql = `DELETE FROM suiciderates WHERE id = ${id}`;
        connection.query(sql, function (err:any, result:any) {
            console.log(result.affectedRows)
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

export function updateSRate(data: any, isXml: boolean, res:any){
    console.log(data)
    console.log('HERE IN UPDATE')
    try{
        connection.query(updateQuerySelector(isXml, data), function (err:any, result:any) {
            if (err){
                throwErrors(res, err)
            }
            return res.status(200).json({'status': '200', 'message': 'OK'})
        });
    }catch (e) {
        console.log(e)
        throwErrors(res, e)
    }
    return true;
}

function updateQuerySelector(isXml: boolean, data: any){
    switch (isXml) {
        case true:
            return`UPDATE suiciderates SET country = '${data.data.country[0]}',year = ${data.data.year[0]},sex = '${data.data.sex[0]}',age = '${data.data.age[0]}',suicides_no = ${data.data.suicide_no[0]},population = ${data.data.population[0]},suicides100k_pop = ${data.data.suicides100k_pop[0]},countryyear = '${data.data.countryyear[0]}' WHERE id = ${data.data.id};`;

        case false:
            return`UPDATE suiciderates SET country = '${data.country[0]}',year = ${data.year[0]},sex = '${data.sex[0]}',age = '${data.age[0]}',suicides_no = ${data.suicide_no[0]},population = ${data.population[0]},suicides100k_pop = ${data.suicides100k_pop[0]},countryyear = '${data.countryyear[0]}' WHERE id = ${data.id};`;
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

export function getSRateCountry(res: any, id: any){
    let sql = `SELECT country, year, SUM(suicides_no) AS sRateSum FROM suiciderates WHERE country = '${id}' AND year >= 1990 AND year <= 2014 GROUP BY year`;
    try{
        connection.query(sql, function (err: any, result: any) {
            if (err){
                throwErrors(res, err)
            } else {
                return res.status(200).json({result})
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