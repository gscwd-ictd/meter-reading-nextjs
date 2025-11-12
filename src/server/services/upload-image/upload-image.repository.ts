import { IUploadImageRepository } from "@mr/server/interfaces/upload-image/upload-image.interface.repository";
import { UploadImage } from "@mr/server/types/upload.type";
import * as Minio from "minio";

export function createFormData(files: File | File[], filePath: string): FormData {
  const formData = new FormData();

  // Ensure the file is always treated as an array
  const fileArray = Array.isArray(files) ? files : [files];

  // Append each file to the form data
  fileArray.forEach((file) => {
    formData.append("file", file);
  });

  // Append fileName and folderName to the form data
  formData.append("fileName", filePath);
  formData.append("folderName", filePath);

  return formData;
}

const minioClient = new Minio.Client({
  endPoint: "172.20.110.45",
  port: 9000,
  useSSL: false,
  accessKey: "q2eEYT1szv9sdKl0dssp",
  secretKey: "VllsO3HsuFGrw8ObD8wg684d5bwuCBDdgYjdkI7H",
});

//MINIO_USER=ictd2022
//MINIO_PASS=ictd@2022

export class UploadImageRepository implements IUploadImageRepository {
  async uploadImage(data: UploadImage): Promise<string> {
    try {
      const buffer = Buffer.from(await data.file.arrayBuffer());
      const result = await minioClient.putObject("meter-reading", data.file.name, buffer);

      const url = await minioClient.presignedUrl("GET", "meter-reading", data.file.name);
      return url.split("?")[0];

      // Return the MinIO file URL or filename
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
