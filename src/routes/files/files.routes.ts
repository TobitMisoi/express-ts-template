import { CommonRoutesConfig } from "../../common/common.routes.config";
import express from "express";
import filesController from "./controllers/files.controller";
import multer from "multer";
import { v4 } from "uuid";
import AWS from "aws-sdk";
import { body } from "express-validator";
import jwtMiddleware from "../../auth/middelware/jwt.middleware";
import pool from "../../common/services/db.service";
export class FileRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "FileRoutes");
  }

  configureRoutes(): express.Application {
    const { validJWTNeeded } = jwtMiddleware;
    const { listFiles, createFile, deleteFile, getFileById } = filesController;
    const storage = multer.memoryStorage(); // Store the file in memory
    const upload = multer({ storage });

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
    });

    this.app
      // .route("/file")
      .post("/documents", upload.single("file"), async (req, res, next) => {
        try {
          if (!req.file) {
            return res.status(400).send("No file uploaded");
          }

          const { filename, originalname, size, mimetype } = req.file;
          const base64Content = Buffer.from(req.file.buffer).toString("base64");

          // Generate a unique filename
          const newFilename = `${v4()}-${filename}`;

          // Upload file to S3
          await s3
            .putObject({
              // @ts-ignore
              Bucket: process.env.S3_BUCKET,
              Key: newFilename,
              Body: req.file.buffer,
              ContentType: mimetype,
            })
            .promise();

          const document: Document = {
            // @ts-ignore
            filename: originalname,
            contentType: mimetype,
            size,
            base64Content,
            s3ObjectKey: newFilename,
          };

          // Save document details to database (using your document service)
          // await documentService.createDocument(document);

          // Return success response
          console.log("Document uploaded successfully!");

          res.status(201).json({ message: "Document uploaded successfully!" });
        } catch (error) {
          console.error("Error uploading document:", error);
          next(error); // Pass error to error handling middleware
        }
      });

    this.app
      .route(`/files`)
      .get(listFiles)
      .post(
        validJWTNeeded,

        upload.single("file"),
        async (req: any, res) => {
          const { file } = req;
          console.log(req.body.pid);
          if (!req.body.pid) {
            return res.status(400).send("No pid.");
          }

          if (!file) {
            return res.status(400).send("No file uploaded.");
          }

          const uploadParams: any = {
            Bucket: process.env.S3_BUCKET,
            Key: v4(),
            Body: file.buffer,
          };
          await s3.upload(
            {
              ...uploadParams,
              Metadata: {
                pid: req.body.pid,
                createdBy: res.locals.jwt.userId,
              },
            },
            (err: any, data: any) => {
              if (err) {
                console.log("Error", err);
                res.status(500).send(err);
              }
              console.log("Upload Success", data.Location);
              res.status(201).send({ message: "uploaded successfully" });
            }
          );

          // res.status(204).send();
        }
      )
      .delete(validJWTNeeded, deleteFile);

    this.app.route("/files/:id").get(validJWTNeeded, getFileById);

    return this.app;
  }
}

// s07IjBi2UOHiCV4DPMtarlyoUybosVj/gkE5S6Nd
// AKIAR6R4BFSR5SM55VUO
