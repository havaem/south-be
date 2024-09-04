import { Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, MongoId, User } from "@/decorators";
import { IUserRequest } from "@/shared/types";

import { ProfileDto } from "./dto/profile.dto";
import { PROFILE_MESSAGES } from "./profile.message";
import { ProfileService } from "./profile.service";

@ApiTags("profile")
@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Api({
        path: "",
        method: "GET",
        responseMessage: PROFILE_MESSAGES.GET_PROFILE_SUCCESS,
        responseType: ProfileDto,
    })
    async getProfile(@User() user: IUserRequest): Promise<ProfileDto> {
        const response = await this.profileService.getByUserId(user._id);
        return response;
    }

    @Api({
        path: ":id",
        method: "GET",
        responseMessage: PROFILE_MESSAGES.GET_PROFILE_SUCCESS,
        responseType: ProfileDto,
    })
    async findOne(@Param("id", MongoId) id: string): Promise<ProfileDto> {
        const response = await this.profileService.getByUserId(id);
        return response;
    }
}
