import { ForbiddenException, Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignUpDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Sign } from "crypto";

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService){}
    
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
                    photo: dto.photo,
                    preference: dto.preference,
                    gender: dto.gender
                },
            });

            delete user.hash;

            // Return the new user
            return user;
        
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

        delete user.hash;
        // Return the user
        return user;
    }

}