/** source/routes/posts.ts */
import express from 'express';
import sController from '../controllers/sRateController';
import mController from '../controllers/mSpendingController';
const router = express.Router();

// s rates routes
//router.get('/sRate', controller.getAllSRate);
//requires header to have key name "type" with value json or xml
router.get('/sRate/:idS/:idE', sController.getRangeSRate);
router.put('/sRate/:id', sController.putUpdateSRate);
router.delete('/sRate/:id', sController.deleteDeleteSRate);
router.post('/sRate', sController.postSRate);

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
// router.get('/mSpending', mController.getAllMSpending);
// router.put('/mSpending/:id', mController.putUpdateMSpending);
// router.delete('/mSpending/:id', mController.deleteDeleteMSpending);
// router.post('/mSpending', mController.postMSpending);
// router.post('/mSpending/:year', mController.postMSpendingAddColumn);

export = router;