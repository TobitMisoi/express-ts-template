import { CommonRoutesConfig } from "../../common/common.routes.config";
import express from "express";
export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }
  configureRoutes() {
    this.app.get(`/users`, (req: express.Request, res: express.Response) => {
      res.status(200).send(`List of users`);
    });
    this.app.post(`/users`, (req: express.Request, res: express.Response) => {
      res.status(200).send(`Post to users`);
    });
    this.app.put(
      `/users/:userId`,
      (req: express.Request, res: express.Response) => {
        res.status(200).send(`Put to users`);
      }
    );
    this.app.patch(
      `/users/:userId`,
      (req: express.Request, res: express.Response) => {
        res.status(200).send(`Patch to users`);
      }
    );
    this.app.delete(
      `/users/:userId`,
      (req: express.Request, res: express.Response) => {
        res.status(200).send(`Delete to users`);
      }
    );
    return this.app;
  }
}
