import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameProfileDocument } from "@/schemas";
import { INDEX, OBJECT_TYPE } from "@/schemas/game-object.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { GameObjectService } from "../game-object/game-object.service";
import { GAME_PROFILE_MESSAGES } from "./game-profile.message";

@Injectable()
export class GameProfileService extends DatabaseService<GameProfileDocument> {
    constructor(
        @InjectModel("GameProfile") private readonly gameProfileModel: Model<GameProfileDocument>,

        private readonly gameObjectService: GameObjectService,
    ) {
        super(gameProfileModel, GAME_PROFILE_MESSAGES);
    }

    async getCurrentUserGameProfile(userId: string) {
        const current = await this.findOne({
            user: userId,
        });
        if (!current) {
            const initGameObject = await this.gameObjectService.create({
                name: "Hero" + userId,
                type: OBJECT_TYPE.LIVEABLE,
                index: INDEX.LIVEABLE,
                data: {
                    body: "66d8375620130a7a713f200f",
                },
            });

            const newDoc = await this.create({
                user: userId,
                hero: initGameObject,
            });

            return newDoc;
        }
        return current;
    }
}
