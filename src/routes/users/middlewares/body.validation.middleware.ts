import { body } from "express-validator";
import express from "express";
class UserBodyValidationMiddleware {
//   checkFields(
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // check body before next
//     const validations = [
//       body("email", "Email must be valid").isEmail(),
//       body("password", "Password must be at least 5 characters").isLength({
//         min: 5,
//       }),
//       body("firstName", "First name must be at least 2 characters").isLength({
//         min: 2,
//       }),
//       body("lastName", "Last name must be at least 2 characters").isLength({
//         min: 2,
//       }),
//     ];

//     res
//       .status(200)
//       .send(
//         validations
//           .map((validation) => validation.run(req))
//           .filter((validation: any) => validation.errors.length > 0)
//       );

//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //   return res.status(422).json({ errors: errors.array() });
//     // }

//     // next();
//   }



}

export default new UserBodyValidationMiddleware();
