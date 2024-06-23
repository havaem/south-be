import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Like } from "./like.schema";
import { Post } from "./post.schema";
import { User } from "./user.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Comment extends BaseSchema {
    @ApiProperty({
        type: [Post],
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, ({ path }) => getRequiredMessage(path)],
    })
    post: Post[];

    @ApiProperty({
        type: [User],
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: [true, ({ path }) => getRequiredMessage(path)],
    })
    author: User[];

    @ApiProperty({
        type: [Like],
        required: true,
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Like.name,
        default: [],
    })
    likes: Like[];

    @ApiProperty({
        type: [Comment],
        required: true,
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Comment.name,
        default: null,
    })
    parent: Comment | null;
}

const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.methods["toDto"] = toDto;

const CommentSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Comment.name,
        useFactory: () => {
            const schema = CommentSchema;
            return schema;
        },
    },
]);

export { CommentSchema, CommentSchemaModule };
