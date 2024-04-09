import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { toDto } from "@/shared/utils/toDto";

export class BaseSchema {
    @ApiProperty()
    _id: string;

    @ApiProperty({
        type: Date,
        nullable: true,
        default: null,
    })
    @Prop({ type: Date, default: null })
    @Exclude()
    deletedAt: Date;

    @ApiProperty({
        type: Date,
    })
    @Exclude()
    createdAt: Date;

    @ApiProperty({
        type: Date,
    })
    @Exclude()
    updatedAt: Date;

    toDto: typeof toDto;
}
