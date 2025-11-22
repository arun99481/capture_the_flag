import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createTeamDto: CreateTeamDto) {
        return this.teamsService.create(user.id, createTeamDto);
    }

    @Post('join')
    join(@CurrentUser() user: any, @Body() joinTeamDto: JoinTeamDto) {
        return this.teamsService.join(user.id, joinTeamDto.joinCode);
    }

    @Get('my-team')
    getMyTeam(@CurrentUser() user: any, @Query('eventId') eventId: string) {
        return this.teamsService.findMyTeam(user.id, eventId);
    }
}
