import { Injectable } from "@nestjs/common";
import { Preference } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class SwipeService{
    constructor(private prismaService: PrismaService){}

    async getPotentialMatches(userId: number, userPreference: Preference){
        // Get a list of users who liked me and matches my preferences:
  
  
        // if there are not enough users who liked me get a list of general users who suits my preferences:
  
  
        // Return the list of users
      }
}