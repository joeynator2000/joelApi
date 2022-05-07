import * as sRateJsonSchema from "../../middleware/suicideRates/jsonSRateSchema.json";
import {Request} from "express";

export function validateSRateJson(req: Request){
    try{
        const Ajv = require("ajv").default
        const ajv = new Ajv({allErrors: true})
        const validate = ajv.compile(sRateJsonSchema)
        const isValid = validate(req.body)
        console.log('JSON VALIDITY: ', isValid)
        return isValid;
    }catch (e) {
        console.log(e)
    }
}
