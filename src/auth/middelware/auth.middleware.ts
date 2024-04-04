import express from 'express';
import pool from '../../common/services/db.service';
import * as argon2 from 'argon2';

class AuthMiddleware {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const results = await new Promise<any[]>((resolve, reject) => {
        pool.query(
          "SELECT * FROM users WHERE email = ?",
          [req.body.email],
          (error: any, results: any[]) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });

      const user = results[0];
      if (user) {
        const passwordHash = user.password;
        if (await argon2.verify(passwordHash, req.body.password)) {
          req.body = {
            userId: user.public_id,
            email: user.email,
            permissionFlags: user.permission,
          };
          return next();
        }
      }

      //   this gives the same message in both cases
      // it helps protect against cracking attempts
      return res
        .status(400)
        .send({ access: false, errors: ["Invalid email and/or password"] });
    } catch (error) {
      console.error(error);
      // Handle the error appropriately
      return res
        .status(500)
        .send({ access: false, errors: ["Internal server error"] });
    }
  }
}

export default new AuthMiddleware();