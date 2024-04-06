import express from "express";
// import debug from "debug";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../../common/services/db.service";
import argon2 from "argon2";
// const log: debug.IDebugger = debug("app:auth-controller");

const jwtSecret: string = process.env.JWT_SECRET || "bridj";
const tokenExpirationInSeconds = 36000;

class AuthController {
  async createJWT(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    console.log(req.body)
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res
        .status(201)
        .send({ access: true, accessToken: token, refreshToken: hash });
    } catch (err) {
      console.log("CreateJWT error: %0", err);
      return res.status(500).send();
    }
  }

  // retrieve user with jwt
  async getUserWithJWT(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const authorization = req?.headers?.["authorization"]?.split(" ");
      if (authorization?.[0] !== "Bearer") {
        return res.status(401).send();
      }
      const userId = jwt.verify(authorization[1], "bridj") as { userId: string };
      pool.query(
        "SELECT * FROM users WHERE public_id = ?",
        [userId?.userId],
        (error: any, results: any) => {
          if (error) {
            console.error("Error retrieving user with JWT:", error);
            res.status(500).send("Error retrieving user with JWT");
            return;
          }
          const user = results[0];
          const { password, identifier, identifierType, ...safeUser } = user;
          res
            .status(200)
            .send({
              fullName: `${user.firstName} ${user.lastName}`,
              ...safeUser,
            });
        }
      );
    } catch (err) {
      console.error("Error retrieving user with JWT:", err);
      res.status(500).send("Error retrieving user with JWT");
    }
  }


  async changePassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    
// update password
    const updateQuery =
      "UPDATE users SET password = ? WHERE public_id = ?";
    const updateParams = [
      await argon2.hash(req.body.password),
      req.body.userId,
    ];
    pool.query(updateQuery, updateParams, (error: any, results: any) => {
      if (error) {
        console.error("Error updating password:", error);
        res.status(500).send("Error updating password");
        return;
      }
      res.status(200).send({ message: "Password updated" });
    });

  }
}

export default new AuthController();
