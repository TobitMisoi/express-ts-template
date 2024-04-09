import { body } from "express-validator";

export interface CreateBusinessDto {
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  email: string;
  website: string;
  registration_type: string;
  description: string;
  address: {
    country: string;
    city: string;
    street: string;
    postal_code: string;
    province: string;
  }
}


export const createBusinessValidationRules = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name must not be empty")
    .bail(),
  // contact which is a json with mandatory fields phone and mail
  body("contact")
    .isObject()
    .withMessage("Contact must be an object")
    .bail(),
  body("contact.phone")
    .isString()
    .withMessage("Phone must be a string")
    .bail(),
  body("contact.email")
    .isEmail()
    .withMessage("Mail must be a valid email")
    .bail(),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email")
    .bail(),
  body("website")
    .isURL()
    .withMessage("Website must be a valid URL")
    .bail(),
  body("registration_type")
    .isString()
    .withMessage("Registration type must be a string")
    .bail(),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .bail(),
  body("address.country")
    .isString()
    .withMessage("Country must be a string")
    .bail(),
  body("address.city")
    .isString()
    .withMessage("City must be a string")
    .bail(),
  body("address.street")
    .isString()
    .withMessage("Street must be a string")
    .bail(),
  body("address.postal_code")
    .isString()
    .withMessage("Postal code must be a string")
    .bail(),
  body("address.province")
    .isString()
    .withMessage("Province must be a string")
    .bail(),
];


export interface BankDetailsDto {
  public_id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  swift_code?: string | null;
  branch_code?: string | null;
  business_id: string;
}

export const bankDetailsValidationRules = [
  body("bank_name")
    .isString()
    .withMessage("Bank name must be a string")
    .bail(),
  body("account_name")
    .isString()
    .withMessage("Account name must be a string")
    .bail(),
  body("account_number")
    .isString()
    .withMessage("Account number must be a string")
    .bail(),
  body("swift_code")
    .isString()
    .optional()
    .withMessage("Swift code must be a string")
    .bail(),
  body("branch_code")
    .isString()
    .optional()
    .withMessage("Branch code must be a string")
    .bail(),
];

