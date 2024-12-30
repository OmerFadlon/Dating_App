import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignUpDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable({})
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService, 
        private config: ConfigService
        ) {}
    
    async signup(dto: SignUpDto) {

        // Transform the password to a hash code
        const hash = await argon.hash(dto.password);
        
        // Add the user to the db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                    name: dto.name,
                    description: dto.description,
                    age: dto.age,
                    minAgePreference: dto.minAgePreference,
                    maxAgePreference: dto.maxAgePreference,
                    gender: dto.gender,
                    genderPreference: dto.genderPreference,
                    city: dto.city
                },
            });

            // Return a jwt
            return this.generateToken(user.id, user.email);
        
        // Handle exeptions in case creation failed
        } catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                switch (error.code){
                    case 'P2002':
                        throw new ForbiddenException('Credentials taken',);
                    case 'P2004':
                        throw new ForbiddenException('A constraint was violated.');
                    default:
                        throw new InternalServerErrorException('Unexpected database error.');
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto) {
        // Verify email by searching it in the User table
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        // If email does not exist throw an exception
        if (!user)
            throw new ForbiddenException('Incorrect email',);
        
        // Compare the given password and the password related to that email in the User table
        const isMatch = await argon.verify(user.hash, dto.password,);

        // If the passwords don't match throw an exception
        if (!isMatch)
            throw new ForbiddenException('Incorrect password',);

        // Return a jwt
        return this.generateToken(user.id, user.email);
    }

    // Generate a JWT Token
    async generateToken(userId: number, email: string): Promise<{jwt_token: string}> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get("JWT_SECRET")

        const token =  await this.jwt.signAsync(
            payload, 
            {
            expiresIn: '60m',
            secret: secret,
            },
        );

        return {
            jwt_token: token,
          };
    }

}