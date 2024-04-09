import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import authMiddleware from "./middelware/auth.middleware";
import jwtMiddleware from "./middelware/jwt.middleware";
import authControllers from "./controller/auth.controllers";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    const { verifyBodyFieldsErrors } = bodyValidationMiddleware;
    const { verifyUserPassword } = authMiddleware;
    const { createJWT } = authControllers;

    this.app.post(
      `/auth`,
      [body("email").isEmail(), body("password").isLength({ min: 5 })],
      verifyBodyFieldsErrors,
      verifyUserPassword,
      createJWT
    );

    // get profile with jwt
    this.app.get(`/profile`, [jwtMiddleware.validJWTNeeded, ]);

    return this.app;
  }
}
