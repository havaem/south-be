import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsString, ValidateNested } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { getInvalidMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { AnimationDocument } from "./animation.schema";
import { BaseSchema } from "./base.schema";
import { Resource, ResourceDocument } from "./resource.schema";

export type SpriteDocument = HydratedDocument<Sprite>;
class Vector2 {
    @IsNumber()
    @Prop({ required: true })
    x: number;

    @IsNumber()
    @Prop({ required: true })
    y: number;
}

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Sprite extends BaseSchema {
    @ApiProperty({
        type: Resource,
        example: "https://example.com/image.png",
        required: true,
    })
    @IsMongoId({
        message: getInvalidMessage("Resource"),
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: [true, getRequiredMessage("Resource")],
    })
    resource: ResourceDocument;

    @ApiProperty({
        example: "Head Blue",
        required: true,
    })
    @IsString()
    @Prop({ trim: true, required: [true, getRequiredMessage("name")] })
    name: string;

    @ApiProperty({
        example: { x: 0, y: 0 },
        required: true,
    })
    @ValidateNested()
    @Type(() => Vector2)
    @Prop({ required: [true, getRequiredMessage("position")] })
    position: Vector2;

    @ApiProperty({
        example: { x: 0, y: 0 },
        required: true,
    })
    @ValidateNested()
    @Type(() => Vector2)
    @Prop({ required: [true, getRequiredMessage("offset")] })
    offset: Vector2;

    @ApiProperty({
        example: { x: 0, y: 0 },
        required: true,
    })
    @ValidateNested()
    @Type(() => Vector2)
    @Prop({ required: [true, getRequiredMessage("frameSize")] })
    frameSize: Vector2;

    @ApiProperty({
        example: "4",
        required: true,
    })
    @IsNumber()
    @Prop({ required: [true, getRequiredMessage("number of vertical frame")] })
    verticalFrame: number;

    @ApiProperty({
        example: "4",
        required: true,
    })
    @IsNumber()
    @Prop({ required: [true, getRequiredMessage("number of horizontal frame")] })
    horizontalFrame: number;

    @ApiProperty({
        example: "1",
        required: true,
    })
    @IsNumber()
    @Prop({ required: [true, getRequiredMessage("default frame")] })
    defaultFrame: number;

    @ApiProperty({
        example: "1",
    })
    @IsNumber(
        {},
        {
            message: getInvalidMessage("scale"),
        },
    )
    @Prop({
        default: 1,
    })
    scale: number;

    @IsMongoId({
        each: true,
        message: getInvalidMessage("Animation"),
    })
    @Prop({
        type: Array<mongoose.Schema.Types.ObjectId>,
        ref: "Animation",
        default: [],
    })
    animations: AnimationDocument[];
}

const SpriteSchema = SchemaFactory.createForClass(Sprite);
SpriteSchema.methods["toDto"] = toDto;

const SpriteSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Sprite.name,
        useFactory: () => {
            const schema = SpriteSchema;
            return schema;
        },
    },
]);

export { SpriteSchema, SpriteSchemaModule };
