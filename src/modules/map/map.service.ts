import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { MapDocument } from "@/schemas/map.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { MAP_MESSAGES } from "./map.message";

export class MapService extends DatabaseService<MapDocument> {
    constructor(@InjectModel("Map") private readonly mapModel: Model<MapDocument>) {
        super(mapModel, MAP_MESSAGES);
    }
}
