import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { getInvalidMessage, getRequiredMessage, getUniqueMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { ResourceDocument } from "./resource.schema";

export type MapDocument = HydratedDocument<Map>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Map extends BaseSchema {
    @ApiProperty({
        example: "Map 1",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Prop({
        required: [true, ({ path }) => getRequiredMessage(path)],
        unique: [true, getUniqueMessage("Resource")],
    })
    name: string;

    @ApiProperty({
        example: "mongoid",
    })
    @IsMongoId({
        message: getInvalidMessage("upperLayer"),
    })
    @IsOptional()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        autopopulate: { select: "src" },
        ref: "Resource",
    })
    upperLayer: ResourceDocument | null;

    @ApiProperty({
        example: "mongoid",
        required: true,
    })
    @IsMongoId({
        message: getInvalidMessage("lowerLayer"),
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: [true, getRequiredMessage("lowerLayer")],
        autopopulate: { select: "src" },
        ref: "Resource",
    })
    lowerLayer: ResourceDocument;

    @ApiProperty({
        example: [
            [0, 1],
            [1, 0],
        ],
        description: "A 2D array representing the map grid",
        required: true,
    })
    @IsArray({
        each: true,
    })
    @Prop({
        type: Array<Array<number>>,
        required: true,
    })
    grid: number[][];
}

const MapSchema = SchemaFactory.createForClass(Map);
MapSchema.methods["toDto"] = toDto;

const MapSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Map.name,
        useFactory: () => {
            const schema = MapSchema;
            return schema;
        },
    },
]);

export { MapSchema, MapSchemaModule };
