import { body } from "express-validator";

export const createEnquiryValidator = [
  body("property")
    .notEmpty()
    .withMessage("Property is required")
    .isMongoId()
    .withMessage("Invalid property ID"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name is too long"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 7, max: 30 })
    .withMessage("Invalid phone number"),

  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email address"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 2000 })
    .withMessage("Message is too long"),

  body("type")
    .optional()
    .isIn([
      "property_enquiry",
      "callback",
      "viewing_request"
    ])
    .withMessage("Invalid enquiry type")
];