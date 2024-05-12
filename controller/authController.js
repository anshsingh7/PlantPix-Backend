import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import slugify from "slugify";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Route : "/api/v1/register"
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, gender, answere, age, role } =
      await req.fields;
    const { photo } = await req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !email:
        return res.status(500).send({ error: "Email is required" });
      case !password:
        return res.status(500).send({ error: "Password is required" });
      case !phone:
        return res.status(500).send({ error: "Phone is required" });
      case !gender:
        return res.status(500).send({ error: "Gender is required" });
      case !age:
        return res.status(500).send({ error: "Age is required" });
      case !answere:
        return res.status(500).send({ error: "Answere is required" });
      case !role:
        return res.status(500).send({ error: "Role is required" });
      case photo && photo.size > 3000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 3mb" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "User already exists",
      });
    }

    const hasedPassword = await hashPassword(password);

    const user = await new User({
      name,
      email,
      password: hasedPassword,
      phone,
      gender,
      age,
      answere,
      role,
      slug: slugify(name),
    });

    if (photo) {
      user.photo.data = fs.readFileSync(photo.path);
      user.photo.contentType = await photo.type;
    }

    await user.save();
    res.status(201).send({
      success: true,
      message: "User saved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating user",
      error,
    });
  }
};

//For Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = await req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Credentials are not be blank",
      });
    }

    //Check user
    const user = await User.findOne({ email }).select("-photo");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "invalid credentials, please check your email and password",
      });
    }

    //token
    const token = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "abrraKaDabra",
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//For Current
export const currentController = async (req, res) => {
  res.send("protected routes");
};

//For forget passowrd
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    //check
    const user = await User.findOne({ email, answer });
    //Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//Update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, gender, answere, age, role } =
      await req.fields;
    const { photo } = await req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !email:
        return res.status(500).send({ error: "Email is required" });
      case !password:
        return res.status(500).send({ error: "Password is required" });
      case !phone:
        return res.status(500).send({ error: "Phone is required" });
      case !gender:
        return res.status(500).send({ error: "Gender is required" });
      case !age:
        return res.status(500).send({ error: "Age is required" });
      case !answere:
        return res.status(500).send({ error: "Answere is required" });
      case !role:
        return res.status(500).send({ error: "Age is required" });
      case photo && photo.size > 3000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 3mb" });
    }

    const user = await User.findById(req.user._id);

    if (photo) {
      return res
        .status(500)
        .send({ error: "Photo is required and should be less than 3mb" });
    }

    //Password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }

    const hashedPassword = password
      ? await hashPassword(password)
      : user.password;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.fields, password: hashedPassword, slug: slugify(name) },
      {
        new: true,
      }
    );
    if (photo) {
      updatedUser.photo.data = fs.readFileSync(photo.path);
      updatedUser.photo.contentType = await photo.type;
    }

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while update profile",
    });
  }
};
