import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class BaseSchema {
    @ApiProperty()
    _id: string;

    @ApiProperty({
        type: Date,
        nullable: true,
        default: null,
    })
    @Prop({ type: Date, default: null })
    deletedAt: Date;

    @ApiProperty({
        type: Date,
    })
    createdAt: Date;

    @ApiProperty({
        type: Date,
    })
    updatedAt: Date;
}
