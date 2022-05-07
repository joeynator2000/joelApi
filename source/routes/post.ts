/** source/routes/posts.ts */
import express from 'express';
import sController from '../controllers/sRateController';
import mController from '../controllers/mSpendingController';
import gCountryController from "../controllers/gCountryController";

const router = express.Router();
//requires header to have key name "type" with value json or xml

// s rates routes
//router.get('/sRate', controller.getAllSRate); //this function was not created as it is useless due to the overall structure of the dataset. furthermore, there are way too many data points for this function to be used effectively
router.get('/sRate/:idS/:idE', sController.getRangeSRate);// this route returns all data points within a specified id range, referring to the exact ID of the database entries.
router.put('/sRate/:id', sController.putUpdateSRate); // is used to update or correct a specified database entry. the uri expects the exact ID of the database entry that should be updated. expects the body with the country, year, and suicide_no that should be updated for the specified entry. header should specify content type of application/json or application/xml according to the contents of the body
router.delete('/sRate/:country', sController.deleteDeleteSRate);//used to delete all suicide rate data of a specified country, which is specified in the uri
router.post('/sRate', sController.postSRate); //used to insert a suicide rate for a specified country in a specified year. expects body with
/**Example json for post military spending api call:
 * {
 *     "country":"asodfoahasdg",
 *     "year":2025,
 *     "suicide_no":12312
 * }
 *
 * */

//dashboard route
router.get('/sRate/:country', sController.getSRateForCountry);//returns all records of a specified country from 1990 to 2014. no body expected. content type should be specified to application/json or application/xml. the uri parameter should specify the country of which the suicide data should be sent.

// military spending routes
router.get('/mSpending', mController.getAllMSpending); // expects a header with content type specifying application/json or application/xml, no body required
// used to populate recordings of military expenditure after column of the year was added. (update)
router.put('/mSpending', mController.putUpdateMSpending);//used to insert new military spending value from a country for an associated year. body expected with countryName, year of expenditure and the amount spent on the military in that year
router.delete('/mSpending/:country', mController.deleteDeleteMSpending); // used to delete all records of a country and its military expenditures recorded in the dataset. no body expected but country specified in uri
router.post('/mSpending', mController.postMSpending);// used to insert new year of data recording along side a new country that was recorded (usually wont be used as all countries that exist should already be recorded) expects body to be sent and content type to be specified for application/json or application/xml
router.post('/mSpending/:year', mController.postMSpendingAddColumn);// used to add a new year of recording into the database. This will only work if the year you are trying to add is the next year of recording. A year cannot be skipped. No body expected
/**Example json for post military spending api call:
 * {
 *     "country":"asodfoahasdg",
 *     "year":2025,
 *     "value":1231
 * }
 *
 * */

// gni routes
router.get('/gniCountry', gCountryController.getAllGniCountry); //returns all recorded gni values for all years for all countries. requires headder to be sent with  content-type key with value of: application/json or application/xml, to specify what data you want to receive
router.put('/gniCountry', gCountryController.putUpdateGniCountry); //used to insert new gni values for a country for an associated year. body expects country, year and the value to update to
router.delete('/gniCountry/:countryName', gCountryController.deleteDeleteGniCountry); //delete by country name where id is the country name
router.post('/gniCountry', gCountryController.postGniCountry); //used to insert new year and country into the dataset (this will not be used as there should not be new countries added to the list of existing countries, however it is an option that is available) expects body with country (that does not exist), year (that has never been recorded), and value
router.post('/gniCountry/:year', gCountryController.postGniCountryAddColumn); //used to insert new column for recorded data into database (only adds year, for adding a new year of recording to the dataset) no body required but year is expected to be a year that has never been recorded before
/**Example json for post gniCountry api call:
 * {
 *     "country":"asodfoahasdg",
 *     "year":2025,
 *     "value":1233
 * }
 *
 * */
export = router;