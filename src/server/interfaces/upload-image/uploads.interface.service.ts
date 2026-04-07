import { UploadImage } from "@mr/server/types/upload.type";

export interface IUploadImageService {
  uploadImage(file: UploadImage): Promise<string>;
}
