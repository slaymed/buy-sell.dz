import { extname, join } from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as FileType from "file-type";
import { HttpException } from "@nestjs/common";
import { diskStorage, StorageEngine } from "multer";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

type File = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: any;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
};

export abstract class BaseStorage {
    public constructor(public readonly destination: string, private readonly allowedSize: number) {}

    protected abstract readonly allowedMimeType: any;
    protected abstract readonly allowedFileExt: any;

    protected get storage(): StorageEngine {
        return diskStorage({
            destination: this.destination,
            filename(req, file, callback) {
                const fileExtension: string = extname(file.originalname);
                callback(null, `${uuidv4()}${fileExtension}`);
            },
        });
    }

    protected fileFilter = (req: any, file: File, callback: (error: Error, acceptFile: boolean) => void): void => {
        callback(null, this.validateMimeType(file.mimetype));
    };

    public validateMimeType(mimeType: any): boolean {
        return Object.values(this.allowedMimeType).includes(mimeType);
    }

    public validateExtension(fileExtension: any): boolean {
        return Object.values(this.allowedFileExt).includes(fileExtension);
    }

    public validateFileSize(file: File): boolean {
        return file.size <= this.allowedSize;
    }

    public async validateFileContent(file: Express.Multer.File): Promise<boolean> {
        const typeResult = await FileType.fromFile(this.locationOf(file.filename));

        return typeResult && this.validateMimeType(typeResult.mime) && this.validateExtension(typeResult.ext);
    }

    public async validate(file: Express.Multer.File): Promise<{ validFile: boolean; error: string | null }> {
        const allowedFileSize = this.validateFileSize(file);
        if (!allowedFileSize) return { validFile: false, error: "Size not allowed" };

        const validFileContent = await this.validateFileContent(file);
        if (!validFileContent) return { validFile: false, error: "Content does not match extension" };

        return { validFile: true, error: null };
    }

    public remove(filename: string): boolean {
        try {
            fs.unlinkSync(this.locationOf(filename));
            return true;
        } catch (error) {
            console.log(error);
            throw new HttpException("Something went wrong", 500);
        }
    }

    public get location(): string {
        return join(process.cwd(), this.destination);
    }

    public locationOf(filename: string) {
        return join(this.location, filename);
    }

    public get multerOptions(): MulterOptions {
        return { storage: this.storage, fileFilter: this.fileFilter };
    }
}
