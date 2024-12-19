import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, UserModule, MatchModule, ChatModule, NotificationModule],
})
export class AppModule {}
