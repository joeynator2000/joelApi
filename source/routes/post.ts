/** source/routes/posts.ts */
import express from 'express';
import controller from '../controllers/post';
const router = express.Router();

//router.get('/sRate', controller.getAllSRate);
router.get('/sRate/:idS/:idE', controller.getsRateRange);
router.put('/sRate/:id', controller.updateSRatePost);
router.delete('/sRate/:id', controller.deleteSRatePost);
router.post('/sRate', controller.addSRatePost);

export = router;