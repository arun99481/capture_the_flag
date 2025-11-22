import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private leaderboardService: LeaderboardService) { }

    @Get(':eventId')
    getStandings(@Param('eventId') eventId: string) {
        return this.leaderboardService.getStandings(eventId);
    }
}
