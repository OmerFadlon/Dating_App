import { Injectable } from "@nestjs/common";
import { GenderPreference, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class SwipeService{
    constructor(private prismaService: PrismaService){}

    async getPotentialMatches(
      userId: number,
      userPreference: { city: string; gender: GenderPreference; minAge: number; maxAge: number },) {

      const { city, gender, minAge, maxAge } = userPreference;

      // Map genderPreference to gender
      const genderFilter =
      gender === 'men'
      ? 'male'
      : gender === 'women'
      ? 'female'
      : undefined;
      
      // A filter for the colums of the result set
      const selectFields = {
        id: true,
        name: true,
        description: true,
        city: true,
        gender: true,
        age: true,
      };
      
      // Step 1: Get users who liked me and match my preferences
      let potentialMatches = await this.prismaService.user.findMany({
        where: {
          likedByUsers: {
            some: { likedUserId: userId },
          },
          city: city,
          gender: genderFilter ? genderFilter : { in: ['male', 'female'] }, // If genderPreference is 'both', skip gender filtering
          age: {
            gte: minAge,
            lte: maxAge,
          },
        },
        take: 50, // Limit to 50 users to 
        select: selectFields,
      });
    
      // Step 2: If not enough users are found, get potential matches who hasn't liked me yet
      if (potentialMatches.length < 50) {
        const additionalMatches = await this.prismaService.user.findMany({
          where: {
            id: {
              notIn: potentialMatches.map((user) => user.id), // Exclude already found matches
              not: userId, // Exclude the current user
            },
            city: city,
            gender: genderFilter ? genderFilter : { in: ['male', 'female'] },
            age: {
              gte: minAge,
              lte: maxAge,
            },
          },
          take: 50 - potentialMatches.length, // Fill the remaining slots
          select: selectFields,
        });
    
        // Combine both match sets
        potentialMatches = [...potentialMatches, ...additionalMatches];
      }
    
      return potentialMatches;
    }
}