import express from 'express';
import {isAdmin, requireSignIn} from '../middleware/authmiddleware.js';
import {createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController} from '../controller/categoryController.js';
import formidable from 'express-formidable';

const router = express.Router();

//routes
// create category
router.post('/create-category', requireSignIn, isAdmin,formidable(), createCategoryController);

// Update category
router.put('/update-category/:id', requireSignIn, isAdmin,formidable(), updateCategoryController);

//getAll category
router.get('/get-category',categoryController);

//single category
router.get('/single-category/:slug', singleCategoryController);

//delete category
router.delete('/delete-category/:slug',requireSignIn, isAdmin ,deleteCategoryController)

export default router;