import { HttpService } from "@nestjs/axios";
import { BadGatewayException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isAxiosError } from "axios";

import { ELocale } from "@/constants";
import { ERole } from "@/constants/role";
import { ProfileDocument, ProfilePopulate } from "@/schemas/profile.schema";
import { UserDocument } from "@/schemas/user.schema";
import { ConfigService } from "@/shared/services/config.service";
import { DatabaseSession } from "@/shared/services/db.service";
import { IUserJwt } from "@/shared/types";
import { generateRandomPassword, getNameDetail } from "@/utils";

import { CreateProfileDto } from "../profile/dto/create-profile.dto";
import { ProfileService } from "../profile/profile.service";
import { RoleService } from "../role/role.service";
import { CreateUserDto } from "../user/dto";
import { UserService } from "../user/user.service";
import { AUTH_MESSAGES } from "./auth.message";
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
        private readonly profileService: ProfileService,
        private readonly databaseSession: DatabaseSession,
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

    async createUser(
        data: CreateUserDto,
        profileData?: Partial<CreateProfileDto>,
    ): Promise<{ user: UserDocument; profile: ProfileDocument }> {
        await this.databaseSession.start();
        try {
            const role = await this.roleService.findOne({ name: ERole.USER });

            const newUser = await this.userService.createMany([{ ...data, roles: [role] }], {
                session: this.databaseSession.session,
            });

            const newProfile = await this.profileService.createMany(
                [
                    {
                        user: newUser[0],
                        name: profileData.name,
                        avatar: profileData.avatar,
                    },
                ],
                {
                    session: this.databaseSession.session,
                },
            );

            await this.databaseSession.commit();
            return {
                user: newUser[0],
                profile: newProfile[0],
            };
        } catch (error) {
            await this.databaseSession.abort();
            throw error;
        }
    }

    /**
     * Registers a new user.
     * @param data - The registration data.
     * @returns A promise that resolves to the created user document.
     */
    async register(data: RegisterDto): Promise<LoginResponseDto> {
        const { name, ...others } = data;
        return await this.generateResponse((await this.createUser(others, { name })).user);
    }

    /**
     * Authenticates a user by their username and password.
     * @param {LoginDto} loginDto - The login data containing the username and password.
     * @returns {Promise<UserDocument>} - The authenticated user.
     * @throws {UnauthorizedException} - If the provided credentials are invalid.
     */
    async login({ username, password }: LoginDto): Promise<LoginResponseDto> {
        const user = await this.userService._findOne({
            $or: [{ email: username }, { username }],
        });
        if (!(await user.comparePassword(password))) throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

        return this.generateResponse(user);
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

                if (!email_verified) throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

                const user = await this.userService.findOne({ email });

                if (user) return this.generateResponse(user);

                const role = await this.roleService.findOne({ name: ERole.USER });

                const newUser = await this.createUser(
                    {
                        email,
                        roles: [role],
                        password: generateRandomPassword(12),
                        locale: locale === ELocale.VI ? ELocale.VI : ELocale.EN,
                    },
                    {
                        name: {
                            ...getNameDetail(given_name),
                            display: locale === ELocale.VI ? -1 : 1,
                        },
                        avatar,
                    },
                );

                return this.generateResponse(newUser.user);
            })
            .catch((error) => {
                if (isAxiosError(error)) throw new BadGatewayException(AUTH_MESSAGES.INVALID_CREDENTIALS);
                throw error;
            });
    }

    async getProfile(_id: string) {
        return (await this.userService._findById(_id)).populate("profile", ProfilePopulate().select);
    }
}
