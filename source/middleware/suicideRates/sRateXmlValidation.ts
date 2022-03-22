import { Request, NextFunction } from 'express';

let validator = require('xsd-schema-validator');

export function xmlSRateValidator(req :Request, res: any, next: NextFunction){
    let returnValue = false;
    try{
        validator.validateXML(req, 'source/middleware/suicideRates/xmlSRSchema.xsd', function(err:any, result:any) {
            if (err) {
                console.log('in err here')
                return next(err)
            }
            console.log('passed error if: ', result.valid)
            returnValue = result.valid
        });
    } catch (e) {
        console.log(e)
    }
    console.log('return value before return:: ', returnValue)
    return returnValue
}
