import jwtMiddleware from "../../auth/middelware/jwt.middleware";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import express from "express";
import businessController from "./controllers/business.controller";
import { body } from "express-validator";
import bodyValidationMiddleware from "./middleware/body.validation.middleware";
import { bankDetailsValidationRules, createBusinessValidationRules } from "./dto/create.business.dto";

export class BusinessRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "BusinessRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route(`/business`)
      .get(
        businessController.listBusinesses,
        (req: express.Request, res: express.Response) => {
          res.status(200).send(`List of business`);
        }
      )
      .post(
        createBusinessValidationRules,
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        bodyValidationMiddleware.validateSameEmailDoesntExist,
        businessController.createBusiness
      );

    this.app
      .route("/business/:id")
      .put(
        createBusinessValidationRules,
        bodyValidationMiddleware.validateSameEmailDoesntExist,
        businessController.updateBusiness
      );

    this.app
      .route("/business/:id/bank-details")
      .post(
        // jwtMiddleware.validJWTNeeded,
        bankDetailsValidationRules,
        bodyValidationMiddleware.validateSingleBankDetailsExist,

        bodyValidationMiddleware.verifyBodyFieldsErrors,
        businessController.addBankDetails
      )
      .get(businessController.getBankDetails);

    return this.app;
  }
}
