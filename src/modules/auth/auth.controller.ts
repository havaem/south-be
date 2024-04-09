import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Public, User } from "@/decorators";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { AuthDto } from "./dto/auth.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("register")
    async register(@Body() data: RegisterDto) {
        const response = this.authService.generateResponse(await this.authService.register(data));
        return response;
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: LoginDto) {
        const response = this.authService.generateResponse(await this.authService.login(data));
        return response;
    }

    @Get()
    async getProfile(@User() { _id }: IUserJwt) {
        const response = await this.authService.getProfile(_id);
        return response.toDto(AuthDto);
    }
}
