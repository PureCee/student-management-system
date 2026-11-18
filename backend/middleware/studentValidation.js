import { body } from "express-validator";

export const registerValidation = [

  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("gender")
    .isIn(["Male", "Female", "Other", "Prefer not to say"])
    .withMessage("Please select a valid gender"),

  body("course")
    .trim()
    .notEmpty()
    .withMessage("Course is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),

  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),

];

export const loginValidation = [

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")

];