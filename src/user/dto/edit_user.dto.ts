import{ IsString, IsEmail, MaxLength, IsEnum, IsUrl, IsOptional, IsInt, Max, Min} from 'class-validator';
import { Gender, GenderPreference } from '@prisma/client';
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
  
   @IsInt()
   @Max(120)
   @Min(16)
   @IsOptional()
   age?: number;

   @IsInt()
   @Max(120)
   @Min(16)
   @IsOptional()
   minAgePreference?: number;

   @IsInt()
   @Max(120)
   @Min(16)
   @IsOptional()
   maxAgePreference?: number;

   @IsEnum(Gender)
   @IsOptional()
   gender?: Gender;

   @IsEnum(GenderPreference)
   @IsOptional()
   genderPreference?: GenderPreference;

   @IsString()
   @MaxLength(50)
   @IsOptional()
   city: string
}