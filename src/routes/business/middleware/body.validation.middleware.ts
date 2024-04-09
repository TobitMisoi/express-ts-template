import express from "express";
import { validationResult } from "express-validator";
import pool from "../../../common/services/db.service";

class BodyValidationMiddleware {
  verifyBodyFieldsErrors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
     await pool.query(
      "SELECT * FROM business WHERE email = ?",
      [req.body.email], (error: any, results: any) => {
        if (error) {
          console.error("Error checking if business exists:", error);
          res.status(500).send("Error checking if business exists");
          return;
        }
        if (results.length > 0) {
          return res.status(400).send({ errors: ["Business Email already exists"] });
        }
        next();
      });

    }

  async validateSingleBankDetailsExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    
    const {id} = req.params;

    await pool.query(
      "SELECT * FROM business_banking_details WHERE business_id = ?",
      [id], (error: any, results: any) => {
        if (error) {
          console.error("Error checking if business exists:", error);
          res.status(500).send("Error checking if business exists");
          return;
        }
        if (results.length > 0) {
          if (results.length > 1) {
            return res.status(400).send({ errors: ["Only one bank detail is allowed for a business"] });
          }
        }
        next();
      });

    }


  }

  

export default new BodyValidationMiddleware();
