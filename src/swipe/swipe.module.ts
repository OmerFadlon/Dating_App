import { Module } from '@nestjs/common';
import { SwipeController } from './swipe.controller';
import { SwipeService } from './swipe.service';
import { MatchService } from 'src/match/match.service';

@Module({
  controllers: [SwipeController],
  providers: [SwipeService, MatchService],
})
export class SwipeModule {}

