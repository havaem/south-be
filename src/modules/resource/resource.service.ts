import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Resource, ResourceDocument } from "@/schemas/resource.schema";
import { DatabaseService } from "@/shared/services/document.service";

@Injectable()
export class ResourceService extends DatabaseService<ResourceDocument> {
    constructor(@InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>) {
        super(resourceModel, {});
    }

    findAll() {
        return this.resourceModel.find();
    }
}
