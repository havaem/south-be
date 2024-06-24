import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Post, PostDocument } from "@/schemas/post.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService extends DatabaseService<PostDocument> {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
        super(postModel, {});
    }

    addPost(createPostDto: CreatePostDto): string {
        return `This action adds a new post`;
    }
}
