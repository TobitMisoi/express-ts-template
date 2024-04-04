import express from "express";
import usersServices from "../../routes/users/user.services";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT } from "../../common/types/jwt";

const jwtSecret: string = process.env.JWT_SECRET || "bridj";
class JwtMiddleware {
  verifyRefreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res.status(400).send({
        access: false,
        errors: ["Missing required field: refreshToken"],
      });
    }
  }
  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersServices.getUserByEmailWithPassword(
      res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac("sha512", salt)
      .update(res.locals.jwt.userId + jwtSecret)
      .digest("base64");

    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags,
      };
      return next();
    } else {
      return res
        .status(400)
        .send({ access: false, errors: ["Invalid refresh token"] });
    }
  }
  validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(401).send();
        } else {
          res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as JWT;
          next();
        }
      } catch (error) {
        return res.status(403).send({ errors: ["Invalid JWT token"] });
      }
    } else {
      return res.status(401).send();
    }
  }
}

export default new JwtMiddleware();
