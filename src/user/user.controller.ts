import { Body, Controller, Get, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Preference, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    /*
    Get my personal profile
    */
    @Get('myProfile')
    getMyProfile(@GetUser() user: User){
        return user;
    }

     /*
    Edit the personal profile info
    */
    @Patch('editProfile')
    editProfile(@GetUser('id') userId: number, @Body() dto: EditUserDto){
        return this.userService.editProfile(userId, dto);
    }

    //should implement a rate limiter on it
    /*
    upload profile picture
    */
    @Patch('uploadPicture')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadProfilePic(@GetUser('id') userId: number, @UploadedFile() file) {
        return this.userService.uploadProfilePic(userId, file.path);
    }

    //deleteAcount
    

}
