import { debug } from "debug";
import AWS from "aws-sdk";
// import jwtMiddleware from "../../../auth/middleware/jwt.middleware";

const log: debug.IDebugger = debug("app:in-memory-dao");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

class FilesDao {
  constructor() {
    log("Files Instance initialized");
  }

  async listFiles() {
    const params: any = {
      Bucket: process.env.S3_BUCKET,
    };

    try {
      const data: any = await s3.listObjectsV2(params).promise();
      const files = (
        await Promise.all(
          data.Contents.map(async (file: any) => {
            const fileData = await s3
              // @ts-ignore
              .getObject({ Bucket: process.env.S3_BUCKET, Key: file.Key })
              .promise();
            const meta = await fileData.Metadata;
            return { file, meta };
          })
        )
      ).reduce((filteredFiles: any[], { file, meta }: any) => {
        if (meta?.createdby === "2bb90bcb-9a2d-4fc9-b8f8-798575a41c95") {
          filteredFiles.push(file);
        }
        return filteredFiles;
      }, []);

      let filteredData = await Promise.all(
        files.map(async (file: any) => {
          const fileData = await s3
            // @ts-ignore
            .getObject({ Bucket: process.env.S3_BUCKET, Key: file.Key })
            .promise();
          const base64Data = fileData.Body?.toString("base64");
          // Get metadata here
          const metadata = fileData.Metadata;
          console.log(fileData);
          return {
            publicId: file.Key,
            data: base64Data,
            ext: fileData.ContentType,
            ...metadata,
          };
        })
      );

      return { total: files.length, data: filteredData };
    } catch (error) {
      // Handle error
      console.error("Error retrieving files from AWS S3:", error);
      throw error;
    }
  }

  async createFile() {
    const parseFile = async () => {
      return "file";
    };

    return parseFile();
  }

  async deleteFile(id: string) {
    // delete from aws s3

    if (!id) {
      return { message: "File id is required" };
    }

    const deleteParams: any = {
      Bucket: process.env.S3_BUCKET,
      Key: id,
    };

    try {
      await s3.deleteObject(deleteParams).promise();
      return { message: "Deleted!" };
    } catch (error) {
      // Handle error
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  async getFileById(id: string) {
    // get from aws s3
    if (!id) {
      return { message: "File id is required" };
    }

    const getParams: any = {
      Bucket: process.env.S3_BUCKET,
      Key: id,
    };

    try {
      const fileData: any = await s3.getObject(getParams).promise();
      const base64Data = fileData.Body?.toString("base64");

      return { name: id, data: base64Data, ext: fileData.ContentType };
    } catch (error: any) {
      return error.code === "NoSuchKey" ? { message: "File not found" } : error;
    }
  }
}

export default new FilesDao();
