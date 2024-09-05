import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameObjectDocument } from "@/schemas/game-object.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { GAME_OBJECT_MESSAGES } from "./game-object.message";

@Injectable()
export class GameObjectService extends DatabaseService<GameObjectDocument> {
    constructor(@InjectModel("GameObject") private readonly GameObjectDocument: Model<GameObjectDocument>) {
        super(GameObjectDocument, GAME_OBJECT_MESSAGES);
    }
}
