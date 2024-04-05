import { body } from "express-validator";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import express from "express";
import bodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import usersController from "./controllers/users.controller";
import jwtMiddleware from "../../auth/middelware/jwt.middleware";


export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }
  configureRoutes() {
    // this.app.get(`/users`, (req: express.Request, res: express.Response) => {
    //   res.status(200).send(`List of users`);
    // });

    // this.app.post(`/users`, (req: express.Request, res: express.Response) => {
    //   res.status(200).send(`Post to users`);
    // })

    const { verifyBodyFieldsErrors, validateSameEmailDoesntExist } = bodyValidationMiddleware;
    const { createUser, listUsers, editUser } = usersController;
    const {validJWTNeeded} = jwtMiddleware

    this.app
      .route(`/users`)
      .get(validJWTNeeded, listUsers)
      .post(
        [
          body("email").isEmail().bail(),
          body("password")
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long')
            .isString()
            .withMessage('Password must be a string')
            .notEmpty()
            .withMessage('Password cannot be empty')
            .bail(), // stop validation if this fails
          body("firstName").isLength({ min: 2, max: 50 }),
          body("lastName").isLength({ min: 2, max: 50 }),
          body("identifier"),
          body("identifierType").isIn(["PASSPORT", "NATIONAL_ID"]),
        ],
        verifyBodyFieldsErrors,
        validateSameEmailDoesntExist,
        createUser
      );

   
    this.app
      .route(`/users/:id`)
      .get(validJWTNeeded, usersController.getUserById)
      .patch(validJWTNeeded, editUser)
      .put(validJWTNeeded, usersController.putUser)
      .delete(validJWTNeeded, usersController.deleteUser);

    return this.app;
  }
}
