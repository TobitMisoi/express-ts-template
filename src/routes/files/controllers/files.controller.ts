import express from "express";
import filesServices from "../files.services";
import debug from "debug";

const log: debug.IDebugger = debug("app:files-controller");

class FilesController {
  async listFiles(req: express.Request, res: express.Response) {
    const files = await filesServices.list();
    res.status(200).send(files);
  }

  async createFile(req: express.Request, res: express.Response) {
    const file = await filesServices.create();
    res.status(201).send(file);
  }

  async deleteFile(req: express.Request, res: express.Response) {
    const file = await filesServices.deleteById(req.body.id);
    res.status(200).send(file);
  }

  async getFileById(req: express.Request, res: express.Response) {
    const file = await filesServices.readById(req.params.id);
    res.status(200).send(file);
  }
}

export default new FilesController();
