import { Module } from "@nestjs/common";

import { AnimationSchemaModule } from "@/schemas";

import { AnimationController } from "./animation.controller";
import { AnimationService } from "./animation.service";

@Module({
    imports: [AnimationSchemaModule],
    controllers: [AnimationController],
    providers: [AnimationService],
})
export class AnimationModule {}
