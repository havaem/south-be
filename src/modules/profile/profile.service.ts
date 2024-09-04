import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ProfileDocument } from "@/schemas/profile.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { ProfileDto } from "./dto/profile.dto";
import { Profile } from "./entities/profile.entity";
import { PROFILE_MESSAGES } from "./profile.message";

@Injectable()
export class ProfileService extends DatabaseService<ProfileDocument> {
    constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {
        super(profileModel, PROFILE_MESSAGES);
    }

    async getByUserId(userId: string): Promise<ProfileDto> {
        const profile = await this._findOne({ user: userId });
        return profile.toDto(ProfileDto);
    }
}
