import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";


// Jwt validation class

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){

    constructor(config: ConfigService,  private prisma: PrismaService,) {
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
          });
    }
    
    async validate(payload:{
        sub: number,
        email: string,
    }) {
        try{
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub
                }
            });

            delete user.hash;
            return user;
        }
        catch (error){
            throw new UnauthorizedException('Failed to validate user');
        }
    }
    
}