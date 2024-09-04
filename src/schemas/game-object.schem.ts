import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, ValidateNested } from "class-validator";
import { HydratedDocument } from "mongoose";

import { getInvalidMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";
import { Vector2 } from "@/utils";

import { BaseSchema } from "./base.schema";

export type GameDocument = HydratedDocument<GameObject>;

export enum OBJECT_TYPE {
    NORMAL = "NORMAL",
    MAP = "MAP",
    LIVEABLE = "LIVEABLE",
}

export enum INDEX {
    NORMAL = 1,
    LIVEABLE = 2,
}

@Schema({
    timestamps: true,
    versionKey: false,
})
export class GameObject extends BaseSchema {
    @IsEnum(OBJECT_TYPE, {
        message: getInvalidMessage("Type"),
    })
    @ApiProperty({
        type: String,
        required: true,
        description: "Type of the object",
    })
    @Prop({
        enum: OBJECT_TYPE,
        default: OBJECT_TYPE.NORMAL,
    })
    type: OBJECT_TYPE;

    @ApiProperty({
        example: { x: 0, y: 0 },
        description: "Position of the object",
    })
    @ValidateNested()
    @Type(() => Vector2)
    @Prop({ required: [true, getRequiredMessage("position")] })
    position: Vector2;

    @IsEnum(INDEX, {
        message: getInvalidMessage("Type"),
    })
    @ApiProperty({
        type: Number,
        description: "Type of the object",
    })
    @Prop({
        enum: INDEX,
        default: INDEX.NORMAL,
    })
    index: INDEX;
}

const GameSchema = SchemaFactory.createForClass(GameObject);
GameSchema.methods["toDto"] = toDto;

const GameSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: GameObject.name,
        useFactory: () => {
            const schema = GameSchema;
            return schema;
        },
    },
]);

export { GameSchema, GameSchemaModule };
