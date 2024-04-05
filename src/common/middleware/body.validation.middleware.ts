import express from "express";
import { validationResult } from "express-validator";
import pool from "../services/db.service";

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
    const user: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email], (error: any, results: any) => {
        if (error) {
          console.error("Error checking if user exists:", error);
          res.status(500).send("Error checking if user exists");
          return;
        }
        if (results.length > 0) {
          return res.status(400).send({ errors: ["User exists already"] });
        }
        next();
      });

    }
  }

  

export default new BodyValidationMiddleware();
