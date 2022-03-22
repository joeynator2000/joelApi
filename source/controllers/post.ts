import { Request, Response, NextFunction } from 'express';
import {deleteSRate, insertSRate, updateSRate, getSRateRange } from '../services/sRateFunctions';
import {validateSRateJson} from "../middleware/suicideRates/sRateJsonValidation";

// getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//     // not implemented as the datasets are very large
// };

// getting a single post
const getsRateRange = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let type: any = req.headers.type;
    let start: string = req.params.idS;
    let end: string = req.params.idE;
    if(!type){
        return returnError400(res)
    }
    getSRateRange(res, start, end, type);
    //console.log(req.rawHeaders.includes('application/json'))s
    // console.log(start)
    // console.log(end)
};

// updating a post
const updateSRatePost = async (req: Request, res: Response, next: NextFunction) => {
    if(req.rawHeaders.includes('application/xml')){
        let validator = require('xsd-schema-validator');
        try{
            //validate against xsd
            validator.validateXML(OBJtoXML(req.body), 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
                if (err) {
                    return returnError400(res);
                }
                // extract values from req.body and insert into db
                let insertResult = updateSRate(req.body, true, res);
                if(insertResult){
                    return returnStatus200(res);
                }
            });
        } catch (e) {
            console.log(e)
        }
    } else if(req.rawHeaders.includes('application/json')){
        let result = validateSRateJson(req, next)
        if(!result){
            return returnError400(res);
        }
        let insertResult = updateSRate(req.body, false, res)
        if(insertResult){
            returnStatus200(res);
        }
    }
};

// deleting a post
const deleteSRatePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: string = req.params.id;
    // delete the post
    deleteSRate(id, res)
};

// adding a post
const addSRatePost = async (req: Request, res: Response, next: NextFunction) => {
    // validate request body check type then give to validator
    //console.log(req.body)
    //console.log('is json: ', req.rawHeaders.includes('application/json'))
    //console.log('is xml: ', JSON.stringify(req.rawHeaders.includes('application/xml')))
    //check if api post is xml or json
    if(req.rawHeaders.includes('application/xml')){
        console.log('kills me')
        let validator = require('xsd-schema-validator');
        try{
            //validate against xsd
            validator.validateXML(OBJtoXML(req.body), 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
                if (err) {
                    return returnError400(res);
                }
                // extract values from req.body and insert into db
                let insertResult = insertSRate(req.body, true, res);
                if(insertResult){
                    return returnStatus200(res);
                }
            });
        } catch (e) {
            console.log(e)
        }
    } else if(req.rawHeaders.includes('application/json')){
        console.log('ok')
        let result = validateSRateJson(req, next)
        if(!result){
            return returnError400(res);
        }
        insertSRate(req.body, false, res)
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

export default { getsRateRange, updateSRatePost, deleteSRatePost, addSRatePost };