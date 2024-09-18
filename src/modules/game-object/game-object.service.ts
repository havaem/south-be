import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameObjectDocument } from "@/schemas/game-object.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { GameProfileService } from "../game-profile/game-profile.service";
import { UpdateGameObjectDto } from "./dto/update-game-object.dto";
import { GAME_OBJECT_MESSAGES } from "./game-object.message";

@Injectable()
export class GameObjectService extends DatabaseService<GameObjectDocument> {
    constructor(
        @InjectModel("GameObject") private readonly GameObjectDocument: Model<GameObjectDocument>,
        @Inject(forwardRef(() => GameProfileService)) private gameProfileService: GameProfileService,
    ) {
        super(GameObjectDocument, GAME_OBJECT_MESSAGES);
    }
    async updateCurrent(userId: string, data: UpdateGameObjectDto) {
        const currentUserGameProfile = await this.gameProfileService._findOne({
            user: userId,
        });

        const currentUserGameObject = await this._findOneAndUpdate({ _id: currentUserGameProfile.hero }, data, {
            new: true,
        });

        return currentUserGameObject;
    }
}
