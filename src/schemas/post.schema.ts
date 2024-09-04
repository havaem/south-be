import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { EMedia } from "@/constants/media";
import { TPostContent } from "@/shared/types";
import { getInvalidMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Comment } from "./comment.schema";
import { Like } from "./like.schema";
import { User, UserDocument } from "./user.schema";

export type PostDocument = HydratedDocument<Post>;

class PostMedia {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsEnum(EMedia, {
        message: ({ property }) => getInvalidMessage(property),
    })
    type: EMedia;

    @ApiProperty({
        type: String,
        required: true,
    })
    @IsUrl(
        {},
        {
            message: ({ property }) => getInvalidMessage(property),
        },
    )
    url: string;
}

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Post extends BaseSchema {
    @ApiProperty({
        type: [User],
        required: true,
    })
    @IsMongoId()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: [true, ({ path }) => getRequiredMessage(path)],
    })
    author: UserDocument | string;

    @ApiProperty({
        type: [PostMedia],
    })
    @Prop([
        {
            type: {
                type: String,
                enum: EMedia,
            },
            url: String,
            _id: false,
        },
    ])
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PostMedia)
    media: {
        type: string;
        url: string;
    }[];

    @ApiProperty({
        type: [Like],
        required: true,
    })
    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Like",
        default: [],
    })
    likes: Like[];

    @ApiProperty({
        type: [Comment],
        required: true,
    })
    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    })
    comments: Comment[];

    @ApiProperty({
        type: [Object],
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.Mixed,
        required: [true, ({ path }) => getRequiredMessage(path)],
    })
    content: TPostContent[];
}

const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.methods["toDto"] = toDto;

const PostSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Post.name,
        useFactory: () => {
            const schema = PostSchema;
            return schema;
        },
    },
]);

export { PostSchema, PostSchemaModule };
