import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

import { REGEX } from "@/constants/regex";
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

export class LoginGoogleDto {
    @ApiProperty({
        example: "example",
        description: "Google ID token",
    })
    @IsString({
        message: getInvalidMessage("Google ID token"),
    })
    @IsNotEmpty({ message: getInvalidMessage("Google ID token") })
    token: string;
}
