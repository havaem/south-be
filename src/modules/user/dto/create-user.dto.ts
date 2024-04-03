import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";

import { REGEX } from "@/constants";
import { getInvalidMessage } from "@/shared/utils";

export class CreateUserDto {
    @ApiProperty()
    @Matches(REGEX.username, {
        message: ({ property }) => getInvalidMessage(property),
    })
    username: string;

    @ApiProperty()
    @Matches(REGEX.password, {
        message: ({ property }) => getInvalidMessage(property),
    })
    password: string;
}
