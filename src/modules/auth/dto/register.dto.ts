import { ApiProperty, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";

import { CreateUserDto } from "@/modules/user/dto/create-user.dto";
import { ProfileName } from "@/schemas/profile.schema";

export class RegisterDto extends PickType(CreateUserDto, ["email", "password"]) {
    @ApiProperty({
        type: ProfileName,
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ProfileName)
    name: {
        first: string;
        middle: string;
        last: string;
        display: number;
    };
}
