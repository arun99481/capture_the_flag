import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'leaderboard',
})
export class LeaderboardGateway {
    @WebSocketServer()
    server: Server;

    broadcastUpdate(eventId: string, data: any) {
        this.server.emit(`leaderboard_update:${eventId}`, data);
    }
}
