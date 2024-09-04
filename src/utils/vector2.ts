import { Prop } from "@nestjs/mongoose";
import { IsNumber } from "class-validator";

export class Vector2 {
    @IsNumber()
    @Prop({ required: true })
    x: number;

    @IsNumber()
    @Prop({ required: true })
    y: number;
}
