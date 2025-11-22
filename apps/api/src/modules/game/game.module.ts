import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from '../../common/prisma.module';
import { AiModule } from '../ai/ai.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AiModule, LeaderboardModule, AuthModule],
    controllers: [GameController],
    providers: [GameService],
})
export class GameModule { }
