import { Injectable, UnauthorizedException } from "@nestjs/common";

import { UserService } from "../user/user.service";
import { AUTH_MESSAGE } from "./auth.message";
import { LoginDto, RegisterDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    async register(data: RegisterDto) {
        return await this.userService.create(data);
    }

    async login({ username, password }: LoginDto) {
        const user = await this.userService._findOne({
            $or: [{ email: username }, { username }],
        });

        if (!user.comparePassword(password)) {
            throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);
        }
        return "login";
    }
}
