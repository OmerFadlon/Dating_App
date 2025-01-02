import { ConsoleLogger, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Gender, GenderPreference, LikeDirection, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Direction } from "readline";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class SwipeService{
    constructor(private prismaService: PrismaService){}
    
    /*
    Get a batch of up to 50 potential matches, based on preferences
     */
    async getPotentialMatches(
      userId: number,
      userPreference: { city: string; gender: GenderPreference; minAge: number; maxAge: number },
    ) {

      // First, get potential matches from users who liked me
      const matchesFromLikes = await this.fetchUsersWhoLikedMe(userId, userPreference);
      
      

      // If more potential matches are needed , fetch additional users who didn't like/dislike me and that i didn't like/dislike them
      if (matchesFromLikes.length < 50) {
        const additionalMatches = await this.fetchPotentialUsers(
          userPreference,
          userId,
          50 - matchesFromLikes.length
        );
        
        // If there are no potential matches, send notification
        if (additionalMatches.length < 1){
          return "No more potential matches"
        }
        return [...matchesFromLikes, ...additionalMatches];
      }
      
      return matchesFromLikes;
    }

    /*
    Swipe right - Add a like to the chosen user
    */
    async swipeRight(userId: number, likedUserId: number){
      try{
        // Add the like to the db
        const like = this.addLike(userId, likedUserId, LikeDirection.like);

        // Check if there is a match
        const likedBack = this.getLike(userId, likedUserId, LikeDirection.like);
        
        // If there is a match: add a match record to the db and notify the users
        /*
        if (likedBack != null ){
          this.MatchService.addMatch(userId, likedUserId);
          this.NotificationService.notify(userId, likedUserId, "match");
          this.NotificationService.notify(likedUserId, userId, "match");
          
        }
        */
       
        return like

      // Handle exeptions in case creation failed
      } catch(error){
          if (error instanceof PrismaClientKnownRequestError){
              switch (error.code){
                  case 'P2002':
                      throw new ForbiddenException('Credentials taken',);
                  default:
                      throw new InternalServerErrorException('Unexpected database error.');
              }
          }
          throw error;
      }
    }

    /*
    Swipe left - add a dislike
    */
    async swipeLeft(userId: number, dislikedUserId: number){
      try{
        // Add a dislike record to the db
        const dislike = this.addLike(userId, dislikedUserId, 'dislike');
       
        return dislike

      // Handle exeptions in case creation failed
      } catch(error){
          if (error instanceof PrismaClientKnownRequestError){
              switch (error.code){
                  case 'P2002':
                      throw new ForbiddenException('Credentials taken',);
                  default:
                      throw new InternalServerErrorException('Unexpected database error.');
              }
          }
          throw error;
      }
    }


    // --------------------------------------HELPER FUNCTIONS:----------------------------------------------------------//

    /*
    Add a like/dislike record to the db
     */
    private async addLike(userId: number, likedUserId: number, direction: LikeDirection){
      const like = await this.prismaService.like.create({
        data:{
            userId: userId,
            likedUserId: likedUserId,
            direction: direction,
        },
      });
      return like
    }

    /*
    get a like record from the db
     */
    private async getLike(userId: number, likedUserId: number, direction: LikeDirection){
      const like = await this.prismaService.like.findUnique({
        where:{
          userId_likedUserId: {
            userId: userId,
            likedUserId: likedUserId,
          },
          direction: direction,
        },
      });

      return like
    }

    /*
    Get a batch of up to 50 potential matches who liked me
     */
    private async fetchUsersWhoLikedMe(
      userId: number,
      preference: { city: string; gender: GenderPreference; minAge: number; maxAge: number }
    ) {

      return await this.prismaService.user.findMany({
        where: {
          likedByUsers: {
            some: { 
              likedUserId: userId,
              direction: LikeDirection.like,
             },
          },
          city: preference.city,
          gender: preference.gender === 'both' ? { in: ['male', 'female'] } : preference.gender === 'men' ? 'male' : 'female',
          age: {
            gte: preference.minAge,
            lte: preference.maxAge,
          },
        },
        take: 50, // Limit to 50 users to 
        select: this.getUserSelectFields(),
      });
    }
    
    /*
    Get a limited number of potential matches who didn't like/dislike me and i didn't like/dislike them
     */
    private async fetchPotentialUsers(
      preference: { city: string; gender: GenderPreference; minAge: number; maxAge: number },
      userId: number,
      limit: number,
    ) {
      return await this.prismaService.user.findMany({
        where: {
          id: { not: userId }, // Exclude the current user
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
          likedByUsers: {
            none: {
              OR: [
                {
                  userId: userId, // Exclude users wich I already like/dislike
                },
                {
                  likedUserId: userId, // Exclude users wich already like/dislike me
                },
              ],
            },
          },
        },
        take: limit, // Limit the results to `limit`
        select: this.getUserSelectFields(), // Select relevant fields
      });
    }

    /*
    Get a field filter for fetching users data
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