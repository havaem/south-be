import { Body, Controller, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, User } from "@/decorators";
import { IUserRequest } from "@/shared/types";

import { AuthService } from "./auth.service";
import { LoginDto, LoginGoogleDto, LoginResponseDto, RegisterDto } from "./dto";
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
        responseType: LoginResponseDto,
    })
    async register(@Body() data: RegisterDto): Promise<LoginResponseDto> {
        const response = this.authService.generateResponse(await this.authService.register(data));
        return response;
    }

    @Api({
        publicRoute: true,
        method: "POST",
        path: "login",
        responseStatus: HttpStatus.OK,
        responseMessage: "User logged in successfully",
        responseType: LoginResponseDto,
    })
    async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
        const response = this.authService.generateResponse(await this.authService.login(data));
        return response;
    }

    @Api({
        publicRoute: true,
        method: "POST",
        path: "login-with-google",
        responseStatus: HttpStatus.OK,
        responseMessage: "User logged in successfully",
        responseType: LoginResponseDto,
    })
    async loginWithGoogle(@Body() data: LoginGoogleDto): Promise<LoginResponseDto> {
        const response = await this.authService.loginWithGoogle(data);
        return response;
    }

    @Api({
        method: "GET",
        path: "",
        responseStatus: HttpStatus.OK,
        responseMessage: "Profile retrieved successfully",
        responseType: AuthDto,
    })
    async getProfile(@User() { _id }: IUserRequest): Promise<AuthDto> {
        const response = await this.authService.getProfile(_id);
        return response.toDto(AuthDto);
    }
}
