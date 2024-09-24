import { Module } from '@nestjs/common';
import { GameEventService } from './game-event.service';
import { GameEventGateway } from './game-event.gateway';

@Module({
  providers: [GameEventGateway, GameEventService],
})
export class GameEventModule {}
