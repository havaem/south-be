import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Sprite, SpriteDocument } from "@/schemas/sprite.schema";
import { DatabaseService } from "@/shared/services/document.service";

@Injectable()
export class SpriteService extends DatabaseService<SpriteDocument> {
    constructor(@InjectModel(Sprite.name) private spriteModel: Model<SpriteDocument>) {
        super(spriteModel, {});
    }

    async getResourceCharacterBuilder() {
        // const sprites = await this.spriteModel.find({
        //     name: {
        //         // if name contains Hairstyle or Eye or Body
        //         $regex: /Hairstyle|Eye|Body/,
        //     },
        // });
        // console.log("sprites: ", sprites);
        return [];
    }
}
