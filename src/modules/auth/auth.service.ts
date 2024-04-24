import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ERole } from "@/constants/role";
import { UserDocument } from "@/schemas/user.schema";
import { ConfigService } from "@/shared/services/config.service";
import { IUserJwt } from "@/shared/types";

import { RoleService } from "../role/role.service";
import { UserService } from "../user/user.service";
import { AUTH_MESSAGE } from "./auth.message";
import { LoginDto, LoginResponseDto, RegisterDto } from "./dto";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateToken(user: UserDocument) {
        const payload: IUserJwt = {
            _id: user._id,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.authConfig.jwtAccessExpirationTime,
            secret: this.configService.authConfig.jwtAccessSecretKey,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.authConfig.jwtRefreshExpirationTime,
            secret: this.configService.authConfig.jwtRefreshSecretKey,
        });
        return { accessToken, refreshToken };
    }

    async generateResponse(user: UserDocument): Promise<LoginResponseDto> {
        return {
            token: this.generateToken(user),
            user: user.toDto(AuthDto),
        };
    }

    async register(data: RegisterDto): Promise<UserDocument> {
        const role = await this.roleService.findOne({ name: ERole.USER });

        return await this.userService.create({ ...data, roles: [role] });
    }

    async login({ username, password }: LoginDto): Promise<UserDocument> {
        const user = await this.userService._findOne({
            $or: [{ email: username }, { username }],
        });

        if (!(await user.comparePassword(password))) throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);

        return user;
    }

    async getProfile(_id: string) {
        return await this.userService._findById(_id);
    }
}
