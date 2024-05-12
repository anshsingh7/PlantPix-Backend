import categoryModel from "../schema/categoryModel.js";
import slugify from "slugify";
import fs from "fs"

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(401).send({ message: "Name is required" });

      case photo && photo.size > 3000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less than 1mb" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    const category =await new categoryModel({ name, slug: slugify(name) });
    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//update category
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    const { id } = req.params;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case photo && photo.size > 3000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less than 1mb" });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    res.status(200).send({
      success: true,
      message: "Category Update Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Updateing category",
      error,
    });
  }
};

//get all category
const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All category List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error white getting all categories",
    });
  }
};

//get single category with slug
const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Single Category",
    });
  }
};

//delete category
const deleteCategoryController = async (req, res) => {
  try {
    // const {id} = req.params;
    await categoryModel.findOneAndDelete({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

export {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
};
