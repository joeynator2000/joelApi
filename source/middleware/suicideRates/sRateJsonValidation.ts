import {sRateJsonSchema} from "./jsonSRateSchema";
import {Request} from "express";

export function validateSRateJson(req: Request){
    const Ajv: any = require("ajv/dist/jtd")
    let ajv = new Ajv.default({ allErrors: true });

    const validate = ajv.compile(sRateJsonSchema)
    let isValid = validate(req.body)
    console.log(isValid)

    if(isValid)
    {
        console.log('VALID')
        return true;
    } else {
        console.log('INVALID')
        return false;
    }
}
