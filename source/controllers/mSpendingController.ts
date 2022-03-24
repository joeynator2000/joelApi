import { Request, Response, NextFunction } from 'express';
import {
    deleteMSpending,
    insertMSpending,
    updateMSpending,
    getMSpendingAll,
    insertNewMSpendingColumn
} from '../services/mSpendingFunctions';
import {validateMSpendingJson} from "../middleware/militarySpending/mSpendingJsonValidation";

// getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//     // not implemented as the datasets are very large
// };

const getAllMSpending = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    console.log(123)
    let type: any = req.headers.type;
    if(!type){
        return returnError400(res)
    }
    getMSpendingAll(res, type);
};

// updating a post
const putUpdateMSpending = async (req: Request, res: Response, next: NextFunction) => {
    if(req.rawHeaders.includes('application/xml')){
        let validator = require('xsd-schema-validator');
        try{
            //validate against xsd
            validator.validateXML(OBJtoXML(req.body), 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
                if (err) {
                    return returnError400(res);
                }
                // extract values from req.body and insert into db
                updateMSpending(req.body, true, res);
            });
        } catch (e) {
            console.log(e)
        }
    } else if(req.rawHeaders.includes('application/json')){
        let result = validateMSpendingJson(req, next)
        if(!result){
            return returnError400(res);
        }
        updateMSpending(req.body, false, res)
    }
};

// deleting a post
const deleteDeleteMSpending = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: string = req.params.id;
    // delete the post
    deleteMSpending(id, res)
};

// adding a post
const postMSpending = async (req: Request, res: Response, next: NextFunction) => {
    // validate request body check type then give to validator
    //console.log(req.body)
    //console.log('is json: ', req.rawHeaders.includes('application/json'))
    //console.log('is xml: ', JSON.stringify(req.rawHeaders.includes('application/xml')))
    //check if api post is xml or json

    if(Object.keys(req.body).length){
        if(req.rawHeaders.includes('application/xml')){
            let validator = require('xsd-schema-validator');
            try{
                //validate against xsd
                validator.validateXML(OBJtoXML(req.body), 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
                    if (err) {
                        return returnError400(res);
                    }
                    // extract values from req.body and insert into db
                    let insertResult = insertMSpending(req.body, true, res);
                    if(insertResult){
                        return returnStatus200(res);
                    }
                });
            } catch (e) {
                console.log(e)
            }
        } else if(req.rawHeaders.includes('application/json')){
            console.log('ok')
            let result = validateMSpendingJson(req, next)
            if(!result){
                return returnError400(res);
            }
            insertMSpending(req.body, false, res)
        }
    } else {
        return returnError400(res)
    }
};

const postMSpendingAddColumn = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let year: string = req.params.year;
    // delete the post
    insertNewMSpendingColumn(year, res)
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

export default { getAllMSpending, putUpdateMSpending, deleteDeleteMSpending, postMSpending, postMSpendingAddColumn };