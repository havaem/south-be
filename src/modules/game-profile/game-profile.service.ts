import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameProfileDocument } from "@/schemas/game-profile";
import { DatabaseService } from "@/shared/services/document.service";

import { GAME_PROFILE_MESSAGES } from "./game-profile.message";

@Injectable()
export class GameProfileService extends DatabaseService<GameProfileDocument> {
    constructor(@InjectModel("GameProfile") private readonly gameProfileModel: Model<GameProfileDocument>) {
        super(gameProfileModel, GAME_PROFILE_MESSAGES);
    }
}
