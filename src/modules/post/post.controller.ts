import { Body, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FormDataRequest, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

import { Api } from "@/decorators";

import { CreatePostDto } from "./dto/create-post.dto";
import { POST_MESSAGES } from "./post.message";
import { PostService } from "./post.service";

export class FormDataTestDto {
    @IsFile()
    @MaxFileSize(1e6)
    @HasMimeType(["image/jpeg", "image/png"])
    avatar: MemoryStoredFile;
}
@ApiTags("post")
@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Api({
        path: "/",
        method: "POST",
        responseMessage: POST_MESSAGES.CREATE,
        responseStatus: 201,
        permissions: ["POST_CREATE"],
    })
    @FormDataRequest()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postService.addPost(createPostDto);
    }
}
