import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Animation, AnimationDocument } from "@/schemas";
import { DatabaseService } from "@/shared/services/document.service";

import { ANIMATION_MESSAGES } from "./animation.message";

@Injectable()
export class AnimationService extends DatabaseService<AnimationDocument> {
    constructor(@InjectModel(Animation.name) private animationModel: Model<AnimationDocument>) {
        super(animationModel, ANIMATION_MESSAGES);
    }
}
