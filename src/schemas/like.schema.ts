import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Comment } from "./comment.schema";
import { Post } from "./post.schema";
import { User } from "./user.schema";

export type LikeDocument = HydratedDocument<Like>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Like extends BaseSchema {
    @ApiProperty({
        type: User,
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: [true, ({ path }) => getRequiredMessage(path)],
    })
    user: User;

    @ApiProperty({
        type: Post,
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    })
    post: Post;

    @ApiProperty({
        type: Comment,
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    })
    comment: Comment;
}

const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.methods["toDto"] = toDto;

const LikeSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Like.name,
        useFactory: () => {
            const schema = LikeSchema;
            return schema;
        },
    },
]);

export { LikeSchema, LikeSchemaModule };
