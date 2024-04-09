import { ApiProperty, PickType } from "@nestjs/swagger";
import { Matches } from "class-validator";

import { REGEX } from "@/constants";
import { getInvalidMessage } from "@/shared/utils";

import { AuthDto } from "./auth.dto";
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

export class LoginResponseDto {
    @ApiProperty()
    token: {
        accessToken: string;
        refreshToken: string;
    };

    @ApiProperty()
    user: AuthDto;
}
