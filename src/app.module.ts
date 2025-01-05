import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { SwipeModule } from './swipe/swipe.module';
import { PrismaErrorHandler } from './prisma/prisma.errorhandler';

@Module({
  imports: [ConfigModule.forRoot({isGlobal : true, }), AuthModule, UserModule, MatchModule, ChatModule, NotificationModule, PrismaModule, SwipeModule],
})
export class AppModule {}
