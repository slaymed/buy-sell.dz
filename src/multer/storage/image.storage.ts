import { ImageFileExtension, ImageMimeType } from '../enum';
import { BaseStorage } from './base.storage';

export class ImageStorage extends BaseStorage {
  protected readonly allowedFileExt = ImageFileExtension;
  protected readonly allowedMimeType = ImageMimeType;
}
