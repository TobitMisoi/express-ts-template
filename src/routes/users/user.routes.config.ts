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

    const { verifyBodyFieldsErrors } = bodyValidationMiddleware;
    const { createUser, listUsers, editUser } = usersController;
    const {validJWTNeeded} = jwtMiddleware

    this.app
      .route(`/users`)
      .get(validJWTNeeded,listUsers)
      .post(
        [body("email").isEmail(), body("password").isLength({ min: 5 })],
        verifyBodyFieldsErrors,
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
