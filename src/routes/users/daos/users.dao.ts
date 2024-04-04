import { v4 } from "uuid";

import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
// import mysqlService, { connection } from "../../common/services/db.service";
import { PermissionFlag } from "../../../common/middleware/common.permissionFlag.enum";
import pool from "../../../common/services/db.service";

// const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  // Connection = mysqlService.getMongoose();

  // userSchema = new this.Schema(
  //   {
  //     _id: String,
  //     email: String,
  //     password: { type: String, select: false },
  //     firstName: String,
  //     lastName: String,
  //     permissionFlags: Number,
  //   },
  //   { id: false }
  // );

  // User = mongooseService.getMongoose().model("Users", this.userSchema);

//   constructor() {
//     log("Create new Instance of UsersDao");
//   }

  async addUser(userFields: CreateUserDto) {
    const userId = v4();
    // mysql
    pool.query(
      "INSERT INTO users (_id, email, password, firstName, lastName, permissionFlags) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userId,
        userFields.email,
        userFields.password,
        userFields.firstName,
        userFields.lastName,
        userFields.permissionFlags || PermissionFlag.FREE_PERMISSION,
      ]
    );

    // const user = new this.User({
    //   _id: userId,
    //   ...userFields,
    //   permissionFlags: PermissionFlag.FREE_PERMISSION,
    // });
    // await user.save();
    return userId;
  }

  async getUserByEmail(email: string) {
    // return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    // return this.User.findOne({ _id: userId }).populate("User").exec();
  }

  async getUsers(limit = 25, page = 0) {
    // return this.User.find()
    //   .limit(limit)
    //   .skip(limit * page)
    //   .exec();
  }

  //  import mysql from 'mysql2/promise';

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    console.log(new Date().toUTCString());
    try {
      const query = `UPDATE users SET ? WHERE id = ?`;
      const values = [{ ...userFields, updated_at: new Date() }, userId];
      await pool.query(query, values, (error: any, results: any) => {
        if (error) {
          console.log(error?.sqlMessage);
        } else {
          return results.affectedRows;
        }
      });
    } catch (error) {
      throw error;
    }
  }
  async removeUserById(userId: string) {
    // return this.User.deleteOne({ _id: userId }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    // return this.User.findOne({ email: email })
    //   .select("_id email permissionFlags +password")
    //   .exec();
  }
}

export default new UsersDao();
