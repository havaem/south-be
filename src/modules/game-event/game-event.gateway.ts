import { AuthWSGuard } from "@/shared/guards/authWS.guard";
import { UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameEventService } from "./game-event.service";

@WebSocketGateway({
    namespace: "game-event",
    cors: "*",
})
export class GameEventGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly gameEventService: GameEventService) {}

    handleConnection(client: Socket) {
        console.log("Client connected");
        console.log(client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected");
        console.log(client.id);
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage("identity")
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }
}
