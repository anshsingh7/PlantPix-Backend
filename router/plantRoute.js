import express from 'express';
import {requireSignIn, isAdmin} from '../middleware/authmiddleware.js';
import { createPlantController, getPlantController, getSinglePlantController, plantPhotoController, deletePlantController, updatePlantController,
plantFilterController, plantCountController, plantListController, searchPlantController, realtedPlantController, plantCategoryController} from '../controller/plantController.js';
import formidable from 'express-formidable';


const router = express.Router();

//routes
//Create Product
router.post('/create-plant', requireSignIn, isAdmin,formidable() ,createPlantController);

//Update Plant
router.put('/update-plant/:pid', requireSignIn, isAdmin,formidable() ,updatePlantController);

//get Plants
router.get('/get-plant', getPlantController);

//single Plant
router.get('/get-plant/:slug', getSinglePlantController);

//get photo
router.get("/Plant-photo/:pid", plantPhotoController);

//delete Plant
router.delete('/delete-plant/:pid', deletePlantController)

//filter Plant
router.post('/plant-filters', plantFilterController)

//Plant count
router.get('/plant-count', plantCountController)

//Plant per page
router.get('/plant-list/:page', plantListController);

//search Plant
router.get('/search/:keyword', searchPlantController);

//similar Plant
router.get('/related-plant/:pid/:cid', realtedPlantController)

//category wise Plant
router.get(`/plant-category/:slug`, plantCategoryController)

export default router;