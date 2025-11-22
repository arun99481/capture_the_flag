import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
    constructor(private gameService: GameService) { }

    @Get(':eventId/status')
    getStatus(@CurrentUser() user: any, @Param('eventId') eventId: string) {
        return this.gameService.getStatus(user.id, eventId);
    }

    @Post(':eventId/challenge/:challengeId/solve')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
    solve(
        @CurrentUser() user: any,
        @Param('eventId') eventId: string,
        @Param('challengeId') challengeId: string,
        @Body('password') password: string,
    ) {
        return this.gameService.solveChallenge(user.id, eventId, challengeId, password);
    }

    @Get(':eventId/challenge/:challengeId/hint/:hintNumber')
    getHint(
        @CurrentUser() user: any,
        @Param('eventId') eventId: string,
        @Param('challengeId') challengeId: string,
        @Param('hintNumber') hintNumber: string,
    ) {
        return this.gameService.getHint(user.id, eventId, challengeId, parseInt(hintNumber));
    }
}
