import { HttpService } from "@nestjs/axios";
import { BadGatewayException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isAxiosError } from "axios";

import { ELocale } from "@/constants";
import { ERole } from "@/constants/role";
import { UserDocument } from "@/schemas/user.schema";
import { ConfigService } from "@/shared/services/config.service";
import { IUserJwt } from "@/shared/types";
import { generateRandomPassword, getNameDetail } from "@/utils";

import { RoleService } from "../role/role.service";
import { UserService } from "../user/user.service";
import { AUTH_MESSAGE } from "./auth.message";
import { LoginDto, LoginGoogleDto, LoginResponseDto, RegisterDto } from "./dto";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
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

    /**
     * Registers a new user.
     * @param data - The registration data.
     * @returns A promise that resolves to the created user document.
     */
    async register(data: RegisterDto): Promise<UserDocument> {
        const role = await this.roleService.findOne({ name: ERole.USER });

        return await this.userService.addPost({ ...data, roles: [role] });
    }

    /**
     * Authenticates a user by their username and password.
     * @param {LoginDto} loginDto - The login data containing the username and password.
     * @returns {Promise<UserDocument>} - The authenticated user.
     * @throws {UnauthorizedException} - If the provided credentials are invalid.
     */
    async login({ username, password }: LoginDto): Promise<UserDocument> {
        const user = await this.userService._findOne({
            $or: [{ email: username }, { username }],
        });

        if (!(await user.comparePassword(password))) throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);

        return user;
    }

    /**
     * Logs in a user using Google authentication.
     * @param {LoginGoogleDto} options - The login options, including the Google token.
     * @returns {Promise<LoginResponseDto>} - The login response.
     * @throws {UnauthorizedException} - If the email is not verified.
     * @throws {BadGatewayException} - If there is an error during the authentication process.
     */
    async loginWithGoogle({ token }: LoginGoogleDto): Promise<LoginResponseDto> {
        return this.httpService.axiosRef
            .get<IGoogleAuthResponse>("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: "Bearer " + token },
            })
            .then(async (res) => {
                const { email, email_verified, given_name, locale, picture: avatar } = res.data;

                if (!email_verified) throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);

                const user = await this.userService.findOne({ email });

                if (user) return this.generateResponse(user);

                const role = await this.roleService.findOne({ name: ERole.USER });
                const newUser = await this.userService.addPost({
                    email,
                    name: {
                        ...getNameDetail(given_name),
                        display: locale === ELocale.VI ? -1 : 1,
                    },
                    roles: [role],
                    password: generateRandomPassword(12),
                    locale: locale === ELocale.VI ? ELocale.VI : ELocale.EN,
                    avatar,
                });
                return this.generateResponse(newUser);
            })
            .catch((error) => {
                if (isAxiosError(error)) throw new BadGatewayException(AUTH_MESSAGE.INVALID_CREDENTIALS);
                throw error;
            });
    }

    async getProfile(_id: string) {
        return await this.userService._findById(_id);
    }
}
