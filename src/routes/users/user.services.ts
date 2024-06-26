import UsersDao from "./daos/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateUserDto } from "./dto/create.user.dto";
import { PutUserDto } from "./dto/put.user.dto";
import { PatchUserDto } from "./dto/patch.user.dto";

class UserService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }
  // @ts-ignore
  async deleteById(id: string) {
    return UsersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UsersDao.getUsers(limit, page);
  }
  // @ts-ignore
  async patchById(id: string, resource: PatchUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  async readById(id: string) {
    return UsersDao.getUserById(id);
  }

  // @ts-ignore
  async putById(id: string, resource: PutUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return UsersDao.getUserByEmailWithPassword(email);
  }
}

export default new UserService();
