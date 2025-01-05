import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MatchDto } from "./dto";
import { PrismaErrorHandler } from "src/prisma/prisma.errorhandler";

@Injectable()
export class MatchService{
    constructor(private prismaService: PrismaService, private errorHandler: PrismaErrorHandler){}

    /*
    Get a list of my matches
     */
    async getMatches(userId: number){

        try {
            const matches = await this.prismaService.match.findMany({
              where: {
                OR: [
                  {
                    userAId: userId,
                  },
                  {
                    userBId: userId,
                  },
                ],
              },
            });
            return matches;
            
        // Handle db related errors
        } catch(error){
            throw this.errorHandler.handleError(error);
        }
    }

    /*
    Add a match between two users to the db
     */
    async addMatch(dto: MatchDto){
        try{
            // Add a match record to the db
        const match = await this.prismaService.match.create({
            data: {
                ...dto,
            },
        });

        return match

        // Handle db related errors
        } catch(error){
            throw this.errorHandler.handleError(error);
        }
    }

    async deleteMatch(dto: MatchDto){
      try{
        const deletedMatch = await this.prismaService.match.delete({
          where:{
            userAId_userBId: {
              userAId: dto.userAId,
              userBId: dto.userBId,
            },
          },
        });
        return deletedMatch;

      } catch(error){
        throw this.errorHandler.handleError(error);
      }
    }
}