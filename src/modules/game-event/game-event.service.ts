import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class GameEventService {
    joinMapSession({ mapId, client }: { mapId: string; client: Socket }) {
        client.join(mapId);
    }

    leaveMapSession({ mapId, client }: { mapId: string; client: Socket }) {
        client.leave(mapId);
    }
}
