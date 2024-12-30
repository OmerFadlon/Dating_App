import{ IsString, IsEmail, MaxLength, IsEnum, IsUrl, IsOptional} from 'class-validator';
import { Preference, Gender } from '@prisma/client';
export class EditUserDto {
   
   @IsEmail()
   @IsOptional()
   email?:  string;

   @IsString()
   @MaxLength(50)
   @IsOptional()
   name?: string;
 
   @IsString()
   @MaxLength(255)
   @IsOptional()
   description?: string;
  
   @IsEnum(Preference)
   @IsOptional()
   preference?: Preference;

   @IsEnum(Gender)
   @IsOptional()
   gender?: Gender;
}