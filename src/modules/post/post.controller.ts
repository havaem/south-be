import { Body, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FormDataRequest, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

import { Api, User } from "@/decorators";
import { IUserRequest } from "@/shared/types";

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
    create(@Body() createPostDto: CreatePostDto, @User() user: IUserRequest) {
        return this.postService.addPost(createPostDto, user._id);
    }

    @Api({
        path: "/",
        responseMessage: POST_MESSAGES.FIND_ALL,
        responseStatus: 200,
    })
    findAll() {
        return this.postService.find({}).populate("author", "name avatar");
    }
}
