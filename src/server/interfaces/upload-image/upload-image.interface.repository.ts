import { UploadImage } from "@mr/server/types/upload.type";

export interface IUploadImageRepository {
  uploadImage(file: UploadImage): Promise<string>;
}
