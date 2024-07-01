import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "@/schemas/user.schema";
import { DatabaseService } from "@/shared/services/document.service";

@Injectable()
export class UserService extends DatabaseService<UserDocument> {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
        super(userModel, {});
    }
}
