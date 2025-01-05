import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";
import { PrismaErrorHandler } from "src/prisma/prisma.errorhandler";
import { User } from "@prisma/client";

@Injectable({})
export class UserService{
    constructor(private prismaService: PrismaService, private errorHandler: PrismaErrorHandler){}
    
    /*
    Edit profile details
     */
    async editProfile(userId: number, dto: EditUserDto){
      try{
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

      } catch(error){
        throw this.errorHandler.handleError(error);
      }
        
    }

    /**
    * Upload a profile picture
    */
    async uploadProfilePic(userId: number, path: string) {
      try{
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

      } catch(error){
        throw this.errorHandler.handleError(error);
      }
    }

}