import{ IsString, IsEmail,  IsNotEmpty, MaxLength, IsEnum, IsOptional, IsInt, Max, Min} from 'class-validator';
import { Gender, GenderPreference } from '@prisma/client';
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

   @IsInt()
   @Max(120)
   @Min(16)
   @IsNotEmpty()
   age: number;

   @IsInt()
   @Max(120)
   @Min(16)
   @IsNotEmpty()
   minAgePreference: number;

   @IsInt()
   @Max(120)
   @Min(16)
   @IsNotEmpty()
   maxAgePreference: number;

   @IsEnum(Gender)
   @IsNotEmpty()
   gender: Gender;

   @IsEnum(GenderPreference)
   @IsNotEmpty()
   genderPreference: GenderPreference;

   @IsString()
   @IsNotEmpty()
   @MaxLength(50)
   city: string

}