import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Post, PostDocument } from "@/schemas/post.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { CloudflareService } from "../cloudflare/cloudflare.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService extends DatabaseService<PostDocument> {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        private readonly clouflareService: CloudflareService,
    ) {
        super(postModel, {});
    }

    async addPost(createPostDto: CreatePostDto, userId: string): Promise<PostDocument> {
        const { content, media } = createPostDto;
        const listUrls: {
            url: string;
            type: string;
        }[] = [];
        for (const file of media) {
            const url = await this.clouflareService.uploadFileToPublicBucket(`posts/${userId}/`, file);
            listUrls.push({
                url,
                type: file.mimetype.split("/")[0],
            });
        }

        const newPost = await this.create({
            author: userId,
            content,
            media: listUrls,
        });

        return newPost;
    }
}
