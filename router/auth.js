import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  currentController,
  updateProfileController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authmiddleware.js";
import formidable from 'express-formidable';


const router = express.Router();

// routing
//REGISTER || Method POST
router.post("/register",formidable(), registerController);

// Forget Password || POST
router.post("/forgot-password", forgotPasswordController);

//LOGIN || Method POST
router.post("/login", loginController);

//CURRENT || Method GET
router.get("/current", requireSignIn, isAdmin, currentController);

//Protected route auth -- for user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Protected route auth -- for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Update profile
router.put("/profile", requireSignIn,formidable(), updateProfileController);

export default router;
