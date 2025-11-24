import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { TeamsModule } from './modules/teams/teams.module';
import { GameModule } from './modules/game/game.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { AiModule } from './modules/ai/ai.module';

import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10,
        }]),
        AuthModule,
        EventsModule,
        TeamsModule,
        GameModule,
        LeaderboardModule,
        AiModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
