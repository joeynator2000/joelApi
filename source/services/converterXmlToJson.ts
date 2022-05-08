import { Request, Response, NextFunction } from 'express';

const converterMethod = async (req: Request, res: Response) => {
    //var convert = require('xml-js');

    //var convertedXmlToJson = convert.xml2json(myXml, {compact: true, spaces: 4});
    console.log(req)
};

export default { converterMethod };