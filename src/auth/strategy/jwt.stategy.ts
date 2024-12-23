import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";


// Jwt validation class

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt',){

    constructor(private config: ConfigService,  private prisma: PrismaService,) {
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
          });
    }

    async validateToken(payload:{
        sub: number,
        email: string,
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });

        delete user.hash;
        return user;
    }
}