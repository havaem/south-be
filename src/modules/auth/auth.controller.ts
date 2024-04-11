import { Body, Controller, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, User } from "@/decorators";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { AuthDto } from "./dto/auth.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Api({
        publicRoute: true,
        method: "POST",
        path: "register",
        responseStatus: HttpStatus.CREATED,
        responseMessage: "User registered successfully",
    })
    async register(@Body() data: RegisterDto) {
        const response = this.authService.generateResponse(await this.authService.register(data));
        return response;
    }

    @Api({
        publicRoute: true,
        method: "POST",
        path: "login",
        responseStatus: HttpStatus.OK,
        responseMessage: "User logged in successfully",
    })
    async login(@Body() data: LoginDto) {
        const response = this.authService.generateResponse(await this.authService.login(data));
        return response;
    }

    @Api({
        method: "GET",
        path: "",
        responseStatus: HttpStatus.OK,
        responseMessage: "Profile retrieved successfully",
    })
    async getProfile(@User() { _id }: IUserRequest) {
        const response = await this.authService.getProfile(_id);
        return response.toDto(AuthDto);
    }
}
