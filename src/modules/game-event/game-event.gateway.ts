import { ESocketEvent } from "@/constants/socket";
import { UserWS } from "@/decorators";
import { AuthWSGuard } from "@/shared/guards/authWS.guard";
import { ConfigService } from "@/shared/services/config.service";
import { IUserRequest } from "@/shared/types";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameObjectService } from "../game-object/game-object.service";
import { GameEventService } from "./game-event.service";

class Player {
    userId: string;
    socketId: string;
    constructor(userId: string, socketId: string) {
        this.userId = userId;
        this.socketId = socketId;
    }
}

class Room {
    roomId: string;
    players: Player[];
    constructor(roomId: string) {
        this.roomId = roomId;
        this.players = [];
    }
}

@WebSocketGateway({
    namespace: "game-event",
    cors: "*",
})
export class GameEventGateway {
    @WebSocketServer() server: Server;
    private players: Map<string, any> = new Map();
    private rooms: Map<string, any> = new Map();

    constructor(
        private readonly gameEventService: GameEventService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly gameObjectService: GameObjectService,
    ) {
        this.startGameLoop();
    }

    async handleConnection(client: Socket) {
        try {
            const accessToken = client.handshake.headers.authorization?.split(" ")[1] ?? "";
            const user: IUserRequest = this.jwtService.verify(accessToken, {
                secret: this.configService.authConfig.jwtAccessSecretKey,
            });

            const newPlayer = new Player(user._id, client.id);
            this.players.set(user._id, newPlayer);

            console.log("Client connected:", user.email);
        } catch (err) {
            console.log("Unauthorized client connection attempt:", client.id);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected");
        console.log(client.id);
    }
    private startGameLoop() {
        setInterval(() => {
            this.gameTick();
        }, 1000 / 60);
    }

    private gameTick() {
        this.players.forEach((player) => {
            // player.updatePosition();
        });

        // Broadcast updated positions to all connected clients
        // this.server.emit(ESocketEvent.UPDATE_POSITION, Array.from(this.players.values()));
    }

    @UseGuards(AuthWSGuard)
    @SubscribeMessage(ESocketEvent.JOIN_MAP)
    async joinMapSession(
        @ConnectedSocket() client: Socket,
        @UserWS() user: IUserRequest,
        @MessageBody() data: { mapId: string },
    ) {
        // connect user to map room
        this.gameEventService.joinMapSession({ mapId: data.mapId, client });

        // add user to room
        const room = this.rooms.get(data.mapId) ?? [];
        room.push(user._id);
        this.rooms.set(data.mapId, room);

        // send message to all users in the room
        this.server.to(data.mapId).emit(ESocketEvent.JOIN_MAP, {
            users: this.rooms.get(data.mapId) ?? [],
        });
    }

    @SubscribeMessage(ESocketEvent.JOIN_MAP)
    async leaveMapSession(
        @ConnectedSocket() client: Socket,
        @UserWS() user: IUserRequest,
        @MessageBody() data: { mapId: string },
    ) {
        // remove user from map room
        this.gameEventService.leaveMapSession({ mapId: data.mapId, client });

        // send message to all users in the room
        this.server.to(data.mapId).emit(ESocketEvent.LEAVE_MAP, { user });
    }
}
