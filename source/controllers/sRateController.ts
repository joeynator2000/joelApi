import { Request, Response, NextFunction } from 'express';
import {
    deleteSRate,
    insertSRate,
    updateSRate,
    getSRateRange,
    getSRateCountry
} from '../services/sRateFunctions';
import {validateSRateJson} from "../middleware/suicideRates/sRateJsonValidation";
import {deleteMSpending} from "../services/mSpendingFunctions";

// getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//     // not implemented as the datasets are very large
// };

const getRangeSRate = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let type: any = req.headers.type;
    let start: string = req.params.idS;
    let end: string = req.params.idE;
    if(!type){
        return returnError400(res)
    }
    getSRateRange(res, start, end, type);
};

const getSRateForCountry = async (req: Request, res: Response, next: NextFunction) =>{
    let type: any = req.headers['content-type'];
    if(req.body.constructor === Object && Object.keys(req.body).length == 0)
    {
        let country: string = req.params.country;
        if(country.length > 0)
        {
            if(type == 'application/xml')
            {
                getSRateCountry(res, country, true);
            } else if(type == 'application/json')
            {
                getSRateCountry(res, country, false);
            } else {
                return returnError400(res)
            }

        } else {
            return returnError400(res)
        }
    } else {
        return returnError400(res)
    }

}

// updating a post
const putUpdateSRate = async (req: Request, res: Response, next: NextFunction) => {
    let type: any = req.headers['content-type'];
    let id: string = req.params.id;
    if(!id.match('^[0-9]*$')){
        return returnError400(res)
    }
    if(req.body.constructor === Object && Object.keys(req.body).length > 0)
    {
        if(type == 'application/xml'){
            let validator = require('xsd-schema-validator');
            try{
                //validate against xsd
                validator.validateXML(OBJtoXML(req.body), 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
                    if (err) {
                        return returnError400(res);
                    }
                    // extract values from req.body and insert into db
                    updateSRate(id, req.body, true, res);
                });
            } catch (e) {
                console.log(e)
                return returnStatus200(res);
            }
        } else if(type == 'application/json'){
            let result = validateSRateJson(req)
            if(!result){
                return returnError400(res);
            }
            updateSRate(id, req.body, false, res)
        } else {
            returnStatus200(res);
        }
    } else {
        returnStatus200(res);
    }
};

// deleting a post
const deleteDeleteSRate = async (req: Request, res: Response, next: NextFunction) => {
    if(req.body.constructor === Object && Object.keys(req.body).length == 0)
    {
        // get the post id from req.params
        let id: string = req.params.country;
        // delete the post
        deleteSRate(id, res)
    } else {
        return returnError400(res);
    }
};

// adding a post
const postSRate = async (req: Request, res: Response, next: NextFunction) => {
    // validate request body check type then give to validator
    //console.log(req.body)
    //console.log('is json: ', req.rawHeaders.includes('application/json'))
    //console.log('is xml: ', JSON.stringify(req.rawHeaders.includes('application/xml')))
    //check if api post is xml or json
    let type: any = req.headers['content-type'];
    if(req.body.constructor === Object && Object.keys(req.body).length > 0)
    {
        if(type == 'application/xml'){
            let validator = require('xsd-schema-validator');
            try{
                //validate against xsd
                validator.validateXML(OBJtoXML(req.body), 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
                    if (err) {
                        return returnError400(res);
                    }
                    // extract values from req.body and insert into db
                    insertSRate(req.body, true, res);
                });
            } catch (e) {
                console.log(e)
                return returnStatus200(res);
            }
        } else if(type == 'application/json'){
            let result = validateSRateJson(req)
            if(!result){
                return returnError400(res);
            }
            insertSRate(req.body, false, res)
        } else {
            return returnError400(res);
        }
    } else {
        return returnError400(res);
    }
};

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

export default { getRangeSRate, putUpdateSRate, deleteDeleteSRate, postSRate, getSRateForCountry };