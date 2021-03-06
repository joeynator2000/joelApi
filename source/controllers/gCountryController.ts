import { Request, Response, NextFunction } from 'express';
import {
    deleteGniCountry,
    insertGniCountry,
    updateGniCountry,
    getGniCountryAll,
    insertNewGniCountryColumn
} from '../services/gniCountryFunctions';
import { validateGniCountryJson } from "../middleware/gniPerCountry/gniCountryJsonValidation";

// getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//     // not implemented as the datasets are very large
// };

const getAllGniCountry = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let type: any = req.headers['content-type'];
    console.log("content type is: ", type)
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        console.log('Object missing');
        if(!type){
            return returnError400(res)
        }
        getGniCountryAll(res, type);
    } else {
        //throw error if body is sent
        return returnError400(res)
    }
};

// updating a post
const putUpdateGniCountry = async (req: Request, res: Response, next: NextFunction) => {
    let type: any = req.headers['content-type'];

    if(req.body.constructor === Object && Object.keys(req.body).length > 0)
    {
        if(type == 'application/xml'){
            let validator = require('xsd-schema-validator');
            try{
                //validate against xsd
                validator.validateXML(OBJtoXML(req.body), 'source/middleware/gniPerCountry/xmlGniCountrySchema.xsd', function(err:any, result:any) {
                    if (err) {
                        return returnError400(res);
                    }
                    // extract values from req.body and insert into db
                    updateGniCountry(req.body, true, res);
                });
            } catch (e) {
                console.log(e)
                return returnError400(res);
            }
        } else if(type == 'application/json'){
            let result = validateGniCountryJson(req)
            if(!result){
                return returnError400(res);
            }
            updateGniCountry(req.body, false, res)
        } else {
            return returnError400(res);
        }
    } else {
        return returnError400(res);
    }
};

// delete a country
const deleteDeleteGniCountry = async (req: Request, res: Response, next: NextFunction) => {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        // get the post id from req.params
        let id: string = req.params.countryName;
        // delete the post
        deleteGniCountry(id, res)
    } else {
        //throw error if body is sent
        return returnError400(res)
    }
};

// adding a post
const postGniCountry = async (req: Request, res: Response, next: NextFunction) => {
    // validate request body check type then give to validator
    //console.log(req.body)
    //console.log('is json: ', req.rawHeaders.includes('application/json'))
    //console.log('is xml: ', JSON.stringify(req.rawHeaders.includes('application/xml')))
    //check if api post is xml or json
    let type: any = req.headers['content-type'];
    if(Object.keys(req.body).length){
        if(type == "application/xml"){
            let validator = require('xsd-schema-validator');
            try{
                //validate against xsd
                validator.validateXML(OBJtoXML(req.body), 'source/middleware/gniPerCountry/xmlGniCountrySchema.xsd', function(err:any, result:any) {
                    if (err) {
                        return returnError400(res);
                    }
                    // extract values from req.body and insert into db
                    insertGniCountry(req.body, true, res);
                });
            } catch (e) {
                console.log(e)
            }
        } else if(type == "application/json"){
            let result = validateGniCountryJson(req)
            if(!result){
                console.log("Json not valid")
                return returnError400(res);
            }
            insertGniCountry(req.body, false, res)
        }
    } else {
        return returnError400(res)
    }
};

const postGniCountryAddColumn = async (req: Request, res: Response, next: NextFunction) => {
    if(req.body.constructor === Object && Object.keys(req.body).length == 0)
    {
        // get the post id from req.params
        let year: string = req.params.year;
        if(year.match('^[0-9]*$'))
        {
            let yearInt: any = parseInt(year);
            if(yearInt > 0)
            {
                // delete the post
                insertNewGniCountryColumn(year, res)
            } else {
                return returnError400(res);
            }
        } else {
            return returnError400(res);
        }
    } else {
        return returnError400(res);
    }
};

// support functions
function returnError400(res: Response){
    return res.status(400).json({'status': '400', 'message': 'Bad input'})
}

function returnStatus200(res: Response){
    return res.status(200).json({'status': '200', 'message': 'OK'})
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

export default { getAllGniCountry, putUpdateGniCountry, deleteDeleteGniCountry, postGniCountry, postGniCountryAddColumn };