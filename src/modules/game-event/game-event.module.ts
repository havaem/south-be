import { Module } from "@nestjs/common";
import { GameObjectModule } from "../game-object/game-object.module";
import { GameEventGateway } from "./game-event.gateway";
import { GameEventService } from "./game-event.service";

@Module({
    imports: [GameObjectModule],
    providers: [GameEventGateway, GameEventService],
})
export class GameEventModule {}
