import { ApiProperty, PickType } from "@nestjs/swagger";
import { Matches } from "class-validator";

import { REGEX } from "@/constants";
import { getInvalidMessage } from "@/shared/utils";

import { RegisterDto } from "./register.dto";

export class LoginDto extends PickType(RegisterDto, ["password"]) {
    @ApiProperty({
        example: "example",
        description: "Username or email",
    })
    @Matches(REGEX.usernameLogin, {
        message: getInvalidMessage("Username or email"),
    })
    username: string;
}
