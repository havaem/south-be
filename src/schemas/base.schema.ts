import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { toDto } from "@/shared/utils/toDto";

export class BaseSchema {
    @ApiProperty()
    _id: string;

    @Prop({ type: Date, default: null })
    @Exclude()
    deletedAt: Date;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    toDto: typeof toDto;
}
