import { Body, Controller, Delete, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard";
import { MatchService } from "./match.service";
import { MatchDto } from "./dto";
import { GetUser } from "src/auth/decorator";

@UseGuards(JwtGuard)
@Controller('matches')
export class MatchController {
    constructor(private matchService: MatchService) {}
    
    @Get('matchList')
    getMatches(@GetUser('id') userId: number){
        return this.matchService.getMatches(userId);
    }

    @Delete('match')
    deleteMatch(@Body() dto: MatchDto){
        return this.matchService.deleteMatch(dto);
    }
}