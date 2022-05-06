//import {mSpendingJsonSchema} from "./jsonGniCountrySchema";
import * as gniCountrySchema from "../../middleware/gniPerCountry/jsonGniCountrySchema.json"
import {NextFunction, Request} from "express";
import {default as Ajv} from "ajv";

export function validateGniCountryJson(req: Request){
    try{
        const Ajv = require("ajv").default
        const ajv = new Ajv({allErrors: true})
        const validate = ajv.compile(gniCountrySchema)
        const isValid = validate(req.body)
        console.log('JSON VALIDITY: ', isValid)
        return isValid;
    }catch (e) {
        console.log(e)
    }
}
