import{ IsString, IsEmail,  IsNotEmpty, MaxLength, IsEnum, IsUrl, IsOptional} from 'class-validator';
import { Preference, Gender } from '@prisma/client';
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
   @IsOptional()
   description: string;
 
   @IsEnum(Preference)
   @IsNotEmpty()
   preference: Preference;

   @IsEnum(Gender)
   @IsNotEmpty()
   gender: Gender;
}