//import {mSpendingJsonSchema} from "./jsonGniCountrySchema";
import * as gniCountrySchema from "../../middleware/gniPerCountry/jsonGniCountrySchema.json"
import {NextFunction, Request} from "express";
import {default as Ajv} from "ajv";

export function validateGniCountryJson(req: Request, next: NextFunction){
    try{
        const Ajv = require("ajv").default
        const ajv = new Ajv({allErrors: true})
        const validate = ajv.compile(gniCountrySchema)
        const isValid = validate(req.body)
        //const Ajv: any = require("ajv/dist/jtd")
        //let ajv = new Ajv.default({ allErrors: true });
        //const Ajv = require("ajv")
        //const ajv = new Ajv()

        //const validate = ajv.compile(gniCountrySchema)
        //const validate = ajv.compile(gniCountrySchema)
        //let isValid = validate(req.body)
        //const isValid = ajv.validate(req.body)
        //const isValid = validate(req.body)
        console.log('JSON VALIDITY: ', isValid)
        if(isValid){
            return isValid
        } else {
            return next()
        }
    }catch (e) {
        console.log(e)
    }
}
