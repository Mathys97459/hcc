import { Controller, Post, Body, Get, Param, Patch, Delete, Request } from '@nestjs/common';
import { MatchService } from './matchs.service';
import { Roles } from '../auth/roles.decorator';

@Controller('matchs')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('/create')
  @Roles('coach')
  async createMatch(@Body() matchData, @Request() req) {
    return this.matchService.createMatch(matchData, req.headers.authorization);
  }

  @Patch('/update/:id')
  @Roles('coach')
  async updateMatch(@Param('id') id: number, @Body() matchData, @Request() req) {
    return this.matchService.updateMatch(id, matchData, req.headers.authorization);
  }

  @Get()
  async getAllMatches() {
    return this.matchService.getAllMatches();
  }

  @Get(':id')
  async getMatchById(@Param('id') id: number) {
    return this.matchService.getMatchById(id);
  }

  @Get('user/:id_user')
  async getMatchsOfPlayer(@Param('id_user') id_user: number) {
    return this.matchService.getMatchsOfPlayer(id_user);
  }

  @Post(':matchId/join')
  async joinMatch(@Param('matchId') matchId: number, @Request() req) {
    return this.matchService.addParticipant(matchId, req.headers.authorization);
  }

  @Delete(':matchId/leave/:userId')
  async leaveMatch(@Param('matchId') matchId: number, @Param('userId') userId: number) {
    return this.matchService.removeParticipant(matchId, userId);
  }
}
