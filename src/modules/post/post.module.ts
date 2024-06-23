import { Module } from "@nestjs/common";

import { PostSchemaModule } from "@/schemas/post.schema";

import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
    imports: [PostSchemaModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
