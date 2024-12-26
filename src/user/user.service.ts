import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";
import { Observable, of } from 'rxjs';

@Injectable({})
export class UserService{
    constructor(private prismaService: PrismaService){}
    
    async editProfile(userId: number, dto: EditUserDto){
        const user = await this.prismaService.user.update({
            where: {
              id: userId,
            },
            data: {
              ...dto,
            },
          });
        
        delete user.hash;

        return user
    }

    async uploadProfilePic(userId: number, path: string) {

      // Add the path of the picture to the User table
      const user = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          photo: path
        },
      });

      delete user.hash
      return user;
    }
}