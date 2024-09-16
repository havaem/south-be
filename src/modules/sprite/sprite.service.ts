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
        const sprites = await this.spriteModel.find({
            name: {
                // if name contains Hairstyle or Eye or Body or Outfit
                $regex: /(Hairstyle|Eye|Body|Outfit)/,
            },
        });

        const groupedSprites = sprites.reduce(
            (acc, sprite) => {
                const name = sprite.name.split("_")[0];
                if (!acc[name]) {
                    acc[name] = [];
                }
                acc[name].push(sprite);
                return acc;
            },
            {
                Hairstyle: [],
                Eye: [],
                Body: [],
                Outfit: [],
            } as {
                [key: string]: SpriteDocument[];
            },
        );

        // sort by name
        Object.keys(groupedSprites).forEach((key) => {
            groupedSprites[key].sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        });

        //limit the number of sprites
        groupedSprites["Hairstyle"] = groupedSprites["Hairstyle"].slice(0, 28);
        groupedSprites["Outfit"] = groupedSprites["Outfit"].slice(0, 61);

        return groupedSprites;
    }
}
