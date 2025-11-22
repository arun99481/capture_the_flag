import { Module } from '@nestjs/common';
import { LeaderboardGateway } from './leaderboard.gateway';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { PrismaModule } from '../../common/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LeaderboardController],
    providers: [LeaderboardGateway, LeaderboardService],
    exports: [LeaderboardGateway, LeaderboardService],
})
export class LeaderboardModule { }
