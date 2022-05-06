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

                let testXMLString = "<root>\n" +
                    "    <Albania>\n" +
                    "        <Y1990>4415</Y1990>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1991>3138</Y1991>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1992>2857</Y1992>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1993>3261</Y1993>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1994>3600</Y1994>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1995>4168</Y1995>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1996>4594</Y1996>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1997>4112</Y1997>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1998>4530</Y1998>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y1999>5141</Y1999>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2000>5562</Y2000>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2001>6093</Y2001>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2002>6358</Y2002>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2003>6760</Y2003>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2004>7147</Y2004>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2005>7557</Y2005>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2006>8125</Y2006>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2007>8671</Y2007>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2008>9199</Y2008>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2009>9376</Y2009>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2010>9828</Y2010>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2011>10210</Y2011>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2012>10293</Y2012>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2013>10669</Y2013>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2014>10797</Y2014>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2015>11098</Y2015>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2016>11534</Y2016>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2017>11831</Y2017>\n" +
                    "    </Albania>\n" +
                    "    <Albania>\n" +
                    "        <Y2018>12300</Y2018>\n" +
                    "    </Albania>\n" +
                    "    <Algeria>\n" +
                    "        <Y1990>9989</Y1990>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1991>9457</Y1991>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1992>9462</Y1992>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1993>9171</Y1993>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1994>8847</Y1994>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1995>8904</Y1995>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1996>9069</Y1996>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1997>9099</Y1997>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1998>9502</Y1998>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y1999>9596</Y1999>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2000>9700</Y2000>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2001>10130</Y2001>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2002>10447</Y2002>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2003>11068</Y2003>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2004>11305</Y2004>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2005>11595</Y2005>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2006>11734</Y2006>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2007>12419</Y2007>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2008>12640</Y2008>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2009>12602</Y2009>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2010>12946</Y2010>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2011>12908</Y2011>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2012>12910</Y2012>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2013>12946</Y2013>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2014>13169</Y2014>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2015>13330</Y2015>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2016>13832</Y2016>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2017>13656</Y2017>\n" +
                    "    </Algeria>\n" +
                    "    <Algeria>\n" +
                    "        <Y2018>13639</Y2018>\n" +
                    "    </Algeria>\n" +
                    "</root>"

                var result2 = convert.xml2json(testXMLString, {compact: true, spaces: 4});
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
