/*
Endpoints:

    @Get
    getPotentialMatches

    @Post
    swipeRight - add a like to a specific match, in case there is a match do some actions

    @Delete
    swipeLeft - dislike user, delete the like if there is one.
    Some how the mechanism of getting the next user should be implemented, 
    either in the client side if he already has a batch of users or in the user module to get a user by id(if the client only saves the id of the batch of users)
*/

import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard";
import { SwipeService } from "./swipe.service";
import { GetUser } from "src/auth/decorator";
import { GenderPreference, User } from "@prisma/client";

@UseGuards(JwtGuard)
@Controller('Swipes')
export class SwipeController{
    constructor(private swipeService: SwipeService){}

    /*
    Get the profiles of a batch of potential matches based on your preferences
    */
    @Get('potentialMatches')
    getPotentialMatches(@GetUser() user: User ){
        const preferences = {city: user.city, gender: user.genderPreference, minAge: user.minAgePreference, maxAge: user.maxAgePreference}
        return this.swipeService.getPotentialMatches(user.id, preferences);
    }

    /*
    Swipe right - Add a like to a chosen user
     */
    @Post('swipeRight')
    async swipeRight(@GetUser('id') userId: number, @Body() body: {likedUserId: number}){
        return this.swipeService.swipeRight(userId, body.likedUserId);
    }

    /*
    Swipe left - delete the like that the given user gave me
    */
    @Post('swipeLeft')
    async swipeLeft(@GetUser('id') userId: number, @Body() body: { likedUserId: number }){
        const dislikedUserId = body.likedUserId
        return this.swipeService.swipeLeft(userId, dislikedUserId);
      }
}