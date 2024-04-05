import argon2 from "argon2";
import express from "express";
import mysql from "mysql";
import { v4 } from "uuid";
import { CreateUserDto } from "../dto/create.user.dto";

const pool = mysql.createPool({
  host: "localhost",
  user: "tobitmisoi",
  password: "4decode?Db",
  database: "bridj_demo",
  timezone: "utc",
});

class UsersController {
  async createUser(req: express.Request, res: express.Response) {
    try {
      // Hash the password using argon2
      req.body.password = await argon2.hash(req.body.password);

      // Insert the user into the database
      const insertQuery = "INSERT INTO users SET ?";
      const { firstName, lastName, email, identifier, password, identifierType, permission }: CreateUserDto = req.body;
      const userId = v4();

      const queryParams = {
        public_id: userId,
        firstName,
        lastName,
        email,
        identifier,
        password,
        identifierType,
        permission,
      };

      pool.query(insertQuery, queryParams, (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).json({ error: "Error creating user" });
          return;
        }

        const createdUserId = result.insertId;
        res.status(201).json({ message: "User created", userId: createdUserId });
      });
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).send("Error hashing password");
    }
  }

  async listUsers(req: express.Request, res: express.Response) {
    pool.query("SELECT * FROM users", (error: any, results: any) => {
      if (error) {
        console.error("Error listing users:", error);
        res.status(500).send("Error listing users");
        return;
      }
      const users = results.map((user: any) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.status(200).send(users);
    });
  }

//   get user by id
async getUserById(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const selectQuery = "SELECT * FROM users WHERE public_id = ?";
    pool.query(selectQuery, [id], (error: any, results: any) => {
      if (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
        return;
      }
      if (results.length === 0) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      const user = results[0];
      const { password, ...safeUser } = user;
      res.status(200).send(safeUser);
    });

}

// put
async putUser(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const { email, firstname, lastname, phoneNumber } = req.body;
    const updateQuery =
      "UPDATE users SET email = ?, firstName = ?, lastName = ?, phoneNumber = ? WHERE public_id = ?";
    const updateParams = [email, firstname, lastname, phoneNumber, id];
    pool.query(updateQuery, updateParams, (error: any, results: any) => {
      if (error) {
        console.error("Error editing user:", error);
        res.status(500).send("Error editing user");
        return;
      }
      res.status(200).send({ message: "User updated" });
    });
  }

  //   edit user
  async editUser(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const { email, firstname, lastname, phoneNumber } = req.body;
    const updateQuery =
      "UPDATE users SET email = ?, firstName = ?, lastName = ?, phoneNumber = ? WHERE public_id = ?";
    const updateParams = [email, firstname, lastname, phoneNumber, id];
    pool.query(updateQuery, updateParams, (error: any, results: any) => {
      if (error) {
        console.error("Error editing user:", error);
        res.status(500).send("Error editing user");
        return;
      }
      res.status(200).send({ message: "User updated" });
    });
  }

  //   delete user
  async deleteUser(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const deleteQuery = "DELETE FROM users WHERE public_id = ?";
    pool.query(deleteQuery, [id], (error: any, results: any) => {
      if (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
        return;
      }
      res.status(200).send({ message: "User deleted" });
    });
  }
}

export default new UsersController();
