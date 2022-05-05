/** source/routes/posts.ts */
import express from 'express';
import sController from '../controllers/sRateController';
import mController from '../controllers/mSpendingController';
import gCountryController from "../controllers/gCountryController";

const router = express.Router();
//requires header to have key name "type" with value json or xml

// s rates routes
//router.get('/sRate', controller.getAllSRate);
router.get('/sRate/:idS/:idE', sController.getRangeSRate);
router.put('/sRate/:id', sController.putUpdateSRate);
router.delete('/sRate/:id', sController.deleteDeleteSRate);
router.post('/sRate', sController.postSRate);

//dashboard route
router.get('/sRate/:id', sController.getSRateForCountry);

// military spending routes
//requires header to have key name "type" with value json or xml
router.get('/mSpending', mController.getAllMSpending);
// used to populate recordings of military expenditure after column of the year was added. (update)
router.put('/mSpending', mController.putUpdateMSpending);
router.delete('/mSpending/:id', mController.deleteDeleteMSpending);
// used to insert new year column and new record to populate it.
router.post('/mSpending', mController.postMSpending);
// used to add a column to db.
router.post('/mSpending/:year', mController.postMSpendingAddColumn);

// gni routes
router.get('/gniCountry', gCountryController.getAllGniCountry); //returns all recorded gni values for all years for all countries. requires headder to be sent with  content-type key with value of: application/json or application/xml, to specify what data you want to receive
router.put('/gniCountry', gCountryController.putUpdateGniCountry); //used to insert new gni values for a country for an associated year. body expects country, year and the value to update to
router.delete('/gniCountry/:id', gCountryController.deleteDeleteGniCountry); //delete by country name where id is the country name
router.post('/gniCountry', gCountryController.postGniCountry); //used to insert new year and country into the dataset (this will not be used as there should not be new countries added to the list of existing countries, however it is an option that is available) expects body with country (that does not exist), year (that has never been recorded), and value
router.post('/gniCountry/:year', gCountryController.postGniCountryAddColumn); //used to insert new column for recorded data into database (only adds year, for adding a new year of recording to the dataset) no body required but year is expected to be a year that has never been recorded before
export = router;