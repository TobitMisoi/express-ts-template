import { CRUD } from "../../common/interfaces/crud.interface";
import filesDao from "./daos/files.dao";

class FileService implements CRUD {
  async list() {
    return filesDao.listFiles();
  }

  async create() {
    return filesDao.createFile();
  }

  async putById(_id: any, _resource: any) {
    return "updated";
  }

  async readById(id: any) {
    return filesDao.getFileById(id);
  }

  async deleteById(id: any) {
    return filesDao.deleteFile(id);
  }

  async patchById(_a: any, _b: any) {
    return "patched";
  }
}

export default new FileService();
