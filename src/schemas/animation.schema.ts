import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { HydratedDocument } from "mongoose";

import { getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";

export type AnimationDocument = HydratedDocument<Animation>;

class AnimationFrames {
    @ApiProperty({
        example: 1000,
        required: true,
        description: "Time in milliseconds",
    })
    @IsNumber()
    time: number;

    @ApiProperty({
        example: 1,
        required: true,
        description: "Frame number",
    })
    @IsNumber()
    frame: number;
}

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Animation extends BaseSchema {
    @IsString()
    @Prop({
        required: [true, getRequiredMessage("name")],
    })
    name: string;

    @ApiProperty({
        example: 1000,
        required: true,
        description: "Duration in milliseconds",
    })
    @IsNumber()
    @Prop({ required: [true, getRequiredMessage("duration")] })
    duration: number;

    @ApiProperty({
        type: [AnimationFrames],
        required: true,
        description: "Array of frames",
    })
    @Prop({ type: Array<AnimationFrames>, required: [true, getRequiredMessage("frames")] })
    frames: AnimationFrames[];
}

const AnimationSchema = SchemaFactory.createForClass(Animation);
AnimationSchema.methods["toDto"] = toDto;

const AnimationSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Animation.name,
        useFactory: () => {
            const schema = AnimationSchema;
            return schema;
        },
    },
]);

export { AnimationSchema, AnimationSchemaModule };
