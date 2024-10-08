import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUrl } from "class-validator";
import { HydratedDocument } from "mongoose";

import { getInvalidMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";

export type ResourceDocument = HydratedDocument<Resource>;

export enum EResourceType {
    MAP_LOWER = "MAP_LOWER",
    MAP_UPPER = "MAP_UPPER",

    CHARACTER_BODY = "CHARACTER_BODY",
    CHARACTER_EYES = "CHARACTER_EYES",
    CHARACTER_OUTFIT = "CHARACTER_OUTFIT",
    CHARACTER_HAIR = "CHARACTER_HAIR",
    CHARACTER_ACCESSORY = "CHARACTER_ACCESSORY",
}

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Resource extends BaseSchema {
    @ApiProperty({
        example: EResourceType.CHARACTER_BODY,
        required: true,
    })
    @IsEnum(EResourceType, { message: getInvalidMessage("type") })
    @Prop()
    type: EResourceType;

    @IsUrl({}, { message: getInvalidMessage("url") })
    @ApiProperty({
        example: "https://example.com/image.png",
        required: true,
    })
    @Prop({ required: [true, getRequiredMessage("url")] })
    src: string;
}

const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.methods["toDto"] = toDto;

type ResourceProps = keyof Resource;

export const ResourcePopulate = (data?: ResourceProps[]) => {
    const defaultOptions: ResourceProps[] = ["_id", "type", "src"];
    return {
        select: data ? defaultOptions.concat(data).join(" ") : defaultOptions.join(" "),
    };
};

const ResourceSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Resource.name,
        useFactory: () => {
            const schema = ResourceSchema;
            return schema;
        },
    },
]);

export { ResourceSchema, ResourceSchemaModule };
