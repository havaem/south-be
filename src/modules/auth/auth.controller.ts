import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body() data: RegisterDto) {
        console.log("data: ", data);
        return this.authService.register(data);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }
}
