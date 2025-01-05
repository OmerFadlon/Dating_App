import { Injectable } from "@nestjs/common";
import { GenderPreference, LikeDirection } from "@prisma/client";
import { MatchService } from "src/match/match.service";
import { PrismaErrorHandler } from "src/prisma/prisma.errorhandler";
import { PrismaService } from "src/prisma/prisma.service";
import { LikeDto } from "./dto/like.dto";

@Injectable({})
export class SwipeService {
  constructor(private prismaService: PrismaService, private matchService: MatchService, private errorHandler: PrismaErrorHandler) { }

  /*
  Get a batch of up to 50 potential matches, based on preferences
   */
  async getPotentialMatches(
    userId: number,
    userPreference: { city: string; gender: GenderPreference; minAge: number; maxAge: number },
  ) {

    try {
      // First, get potential matches from users who liked me
      const matchesFromLikes = await this.fetchUsersWhoLikedMe(userId, userPreference);
      
      // If more potential matches are needed , fetch additional users who didn't like/dislike me and that i didn't like/dislike them
      if (matchesFromLikes.length < 50) {
        const additionalMatches = await this.fetchPotentialUsers(
          userPreference,
          userId,
          50 - matchesFromLikes.length
        );

        return [...matchesFromLikes, ...additionalMatches];
      }

      return matchesFromLikes;

    // Forward the Exeptions wich are handled by the helper functions
    } catch (error) {
      throw error;
    }
  }

  /*
  Swipe right - Add a like to the chosen user
  */
  async swipeRight(dto: LikeDto) {
    try {
      // Add the like to the db
      const newLike = await this.addLike(dto);

      // Check if there is a match
      const likedBack = await this.getLike({userId: dto.likedUserId, likedUserId: dto.userId, direction: dto.direction});

      // If there is a match
      if (likedBack != null) {
        // Create a unique match record - userAId must be smaller than userBId
        const userAId = Math.min(dto.userId, dto.likedUserId);
        const userBId = Math.max(dto.userId, dto.likedUserId);
        // Add the match to the db
        const match = await this.matchService.addMatch({ userAId: userAId, userBId: userBId });

        // Notify the users  ------------implement----------------:
        
        return match;
      }

      return newLike
      
    // Forward the Exeptions wich are handled by the helper functions
    } catch (error) {
      throw error;
    }
  }

  /*
  Swipe left - add a dislike
  */
  async swipeLeft(dto: LikeDto) {
    try {
      // Add a dislike record to the db
      const dislike = await this.addLike(dto);

      return dislike

    // Forward the Exeptions wich are handled by the helper functions
    } catch (error) {
      throw error;
    }
  }


  // --------------------------------------HELPER FUNCTIONS:----------------------------------------------------------//

  /*
  Add a like/dislike record to the db
   */
  private async addLike(dto: LikeDto) {
    try {
      // Add a like/dislike record to the db
      const like = await this.prismaService.like.create({
        data: {
          ...dto,
        },
      });

      return like;

    // Handle dataBase related Errors
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }

  /*
  get a like record from the db
   */
  private async getLike(dto: LikeDto) {
    try{
      const like = await this.prismaService.like.findUnique({
        where: {
          userId_likedUserId: {
            userId: dto.userId,
            likedUserId: dto.likedUserId,
          },
          direction: dto.direction,
        },
      });
  
      return like
    // Handle dataBase related Errors  
    } catch(error){
      throw this.errorHandler.handleError(error);
    }
  }

  /*
  Get a batch of up to 50 potential matches(based on my preferences) who liked me
   */
  private async fetchUsersWhoLikedMe(
    userId: number,
    preference: { city: string; gender: GenderPreference; minAge: number; maxAge: number }
  ) {
    try {
      return await this.prismaService.user.findMany({
        where: {
          AND: [
            // Users who have liked me
            {
              givenLikes: {
                some: {
                  likedUserId: userId,
                  direction: LikeDirection.like,
                },
              },
            },
            // But not myself
            {
              NOT: {
                id: userId,
              },
            },
            // Match my preferences
            {
              city: preference.city,
              gender: preference.gender === 'both' 
                ? { in: ['male', 'female'] } 
                : preference.gender === 'men' ? 'male' : 'female',
              age: {
                gte: preference.minAge,
                lte: preference.maxAge,
              },
            },
            // Exclude users I've already liked/dislike
            {
              NOT: {
                likedByUsers: {
                  some: {
                    userId: userId,
                  },
                },
              },
            },
          ],
        },
        take: 50,
        select: this.getUserSelectFields(),
      });
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }
  
  /*
  Get a limited number of potential matches(based on my preferences) who didn't like/dislike me and i didn't like/dislike them
   */
  private async fetchPotentialUsers(
    preference: { city: string; gender: GenderPreference; minAge: number; maxAge: number },
    userId: number,
    limit: number,
  ) {
    try{
      return await this.prismaService.user.findMany({
        where: {
          // Not myself
          id: { not: userId },
           
          // Match my preferences
          city: preference.city,
          gender:
            preference.gender === 'both'
              ? { in: ['male', 'female'] }
              : preference.gender === 'men'
                ? 'male'
                : 'female',
          age: {
            gte: preference.minAge,
            lte: preference.maxAge,
          },

          // Exclude users I've already liked/disliked
          likedByUsers: {
            none: {
              userId: userId, 
            },
          },
          // Exclude users who has already liked/disliked me
          givenLikes: {
            none:{
              likedUserId: userId,
            }
          }
        },
        take: limit, // Limit the results to `limit`
        select: this.getUserSelectFields(), // Select relevant fields
      });
    
    // Handle dataBase related Errors
    } catch(error){
      throw this.errorHandler.handleError(error);
    }
  }

  /*
  Get a filter for fetching users data
  */
  private getUserSelectFields() {
    return {
      id: true,
      name: true,
      description: true,
      city: true,
      gender: true,
      age: true,
    };
  }
}