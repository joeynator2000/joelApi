import {mSpendingJsonSchema} from "./jsonMSpendingSchema";
import {NextFunction, Request} from "express";

export function validateMSpendingJson(req: Request, next: NextFunction){
    try{
        const Ajv: any = require("ajv/dist/jtd")
        let ajv = new Ajv.default({ allErrors: true });

        const validate = ajv.compile(mSpendingJsonSchema)
        let isValid = validate(req.body)
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
