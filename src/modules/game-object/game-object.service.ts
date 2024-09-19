import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameObjectDocument } from "@/schemas/game-object.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { Sprite } from "@/schemas";
import { GameProfileService } from "../game-profile/game-profile.service";
import { SpriteService } from "../sprite/sprite.service";
import { UpdateGameObjectDto } from "./dto/update-game-object.dto";
import { GAME_OBJECT_MESSAGES } from "./game-object.message";

@Injectable()
export class GameObjectService extends DatabaseService<GameObjectDocument> {
    constructor(
        @InjectModel("GameObject") private readonly GameObjectDocument: Model<GameObjectDocument>,
        @Inject(forwardRef(() => GameProfileService)) private gameProfileService: GameProfileService,
        private readonly spriteService: SpriteService,
    ) {
        super(GameObjectDocument, GAME_OBJECT_MESSAGES);
    }
    async updateCurrent(userId: string, data: UpdateGameObjectDto) {
        const currentUserGameProfile = await this.gameProfileService._findOne({ user: userId });

        const currentUserGameObject = await this._findOneAndUpdate({ _id: currentUserGameProfile.hero }, data, {
            new: true,
        });

        const bodyParts = currentUserGameObject.data;
        const spritePromises = Object.entries(bodyParts).map(async ([key, value]) => {
            if (value !== undefined) {
                const sprite = await this.spriteService.findOne({ _id: value });
                if (sprite) {
                    currentUserGameObject.data[key] = sprite.toDto(Sprite);
                }
            }
        });

        await Promise.all(spritePromises);

        return currentUserGameObject;
    }

    async findByIdAndPopulate(id: string) {
        const gameObject = await this._findById(id);

        const bodyParts = gameObject.data;
        const spritePromises = Object.entries(bodyParts).map(async ([key, value]) => {
            if (value !== undefined) {
                const sprite = await this.spriteService.findOne({ _id: value });
                if (sprite) {
                    gameObject.data[key] = sprite.toDto(Sprite);
                }
            }
        });

        await Promise.all(spritePromises);

        return gameObject;
    }
}
