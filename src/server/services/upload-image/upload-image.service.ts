import { IUploadImageRepository } from "@mr/server/interfaces/upload-image/upload-image.interface.repository";
import { IUploadImageService } from "@mr/server/interfaces/upload-image/uploads.interface.service";
import { UploadImage } from "@mr/server/types/upload.type";

export class UploadImageService implements IUploadImageService {
  constructor(private readonly repository: IUploadImageRepository) {}
  async uploadImage(file: UploadImage): Promise<string> {
    return await this.repository.uploadImage(file);
  }
}
