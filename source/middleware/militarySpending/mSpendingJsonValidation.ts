import * as mSpendingJsonSchema from "../../middleware/militarySpending/jsonMSpendingSchema.json";
import {Request} from "express";

export function validateMSpendingJson(req: Request){
    try{
        const Ajv = require("ajv").default
        const ajv = new Ajv({allErrors: true})
        const validate = ajv.compile(mSpendingJsonSchema)
        const isValid = validate(req.body)
        console.log('JSON VALIDITY: ', isValid)
        return isValid;
    }catch (e) {
        console.log(e)
    }
}
