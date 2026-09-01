import { body } from "express-validator";

export const createPropertyValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Property title is required"),

  body("propertyType")
    .notEmpty()
    .withMessage("Property type is required")
    .isIn([
      "plot",
      "house",
      "apartment",
      "farmhouse",
      "commercial"
    ])
    .withMessage("Invalid property type"),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required")
    .isIn(["sale", "rent"])
    .withMessage("Purpose must be sale or rent"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("society")
    .trim()
    .notEmpty()
    .withMessage("Society is required"),

  body("size.value")
    .notEmpty()
    .withMessage("Property size is required")
    .isNumeric()
    .withMessage("Property size must be a number")
    .custom((value) => value > 0)
    .withMessage("Property size must be greater than 0"),

  body("size.unit")
    .notEmpty()
    .withMessage("Size unit is required")
    .isIn(["marla", "kanal", "sqft"])
    .withMessage("Invalid size unit"),

  body("price.amount")
    .notEmpty()
    .withMessage("Property price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Property description is required")
    .isLength({ min: 20 })
    .withMessage("Description must contain at least 20 characters")
];