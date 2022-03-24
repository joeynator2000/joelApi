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
router.get('/gniCountry', gCountryController.getAllGniCountry);
router.put('/gniCountry/:id', gCountryController.putUpdateGniCountry);
router.delete('/gniCountry/:id', gCountryController.deleteDeleteGniCountry);
router.post('/gniCountry', gCountryController.postGniCountry);
router.post('/gniCountry/:year', gCountryController.postGniCountryAddColumn);

export = router;