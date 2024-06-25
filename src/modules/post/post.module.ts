import { Module } from "@nestjs/common";

import { PostSchemaModule } from "@/schemas/post.schema";

import { CloudflareModule } from "../cloudflare/cloudflare.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
    imports: [PostSchemaModule, CloudflareModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
