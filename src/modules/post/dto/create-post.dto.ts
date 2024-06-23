import { PickType } from "@nestjs/swagger";
import { ArrayMaxSize, IsOptional } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFiles, MaxFileSize } from "nestjs-form-data";

import { EFileType } from "@/constants/media";
import { Post } from "@/schemas/post.schema";
import { convertToBytes } from "@/utils";

export class CreatePostDto extends PickType(Post, ["content"]) {
    @IsOptional()
    @IsFiles()
    @MaxFileSize(convertToBytes(1, "MB"), { each: true }) //1MB
    @HasMimeType([EFileType.JPEG, EFileType.PNG, EFileType.JPG, EFileType.MP4], { each: true })
    @ArrayMaxSize(5)
    media: FileSystemStoredFile;
}
