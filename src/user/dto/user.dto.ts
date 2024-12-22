import{ IsString, IsEmail,  IsNotEmpty, MaxLength, IsEnum, IsUrl} from 'class-validator';
import { Preference } from '@prisma/client';
export class SignUpDto {
   
   @IsEmail()
   @IsNotEmpty()
   email:  string;

   @IsString()
   @IsNotEmpty()
   password: string;

   @IsString()
   @IsNotEmpty()
   @MaxLength(50)
   name: string;
 
   @IsString()
   @MaxLength(255)
   description: string;
   
   @IsUrl()
   @IsString()
   photo: string;
 
   @IsEnum(Preference)
   preference: string;
   
}