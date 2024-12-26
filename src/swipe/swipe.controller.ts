/*
Endpoints:

    @Get
    explore - get a batch of potential matches based on preferences

    @Post
    swipeRight - add a like to a specific match, in case there is a match do some actions

    @Delete
    swipeLeft - dislike user, delete the like if there is one.
    Some how the mechanism of getting the next user should be implemented, 
    either in the client side if he already has a batch of users or in the user module to get a user by id(if the client only saves the id of the batch of users)
*/