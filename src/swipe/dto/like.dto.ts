import { LikeDirection } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class LikeDto{

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    likedUserId: number;

    @IsEnum(LikeDirection)
    direction: LikeDirection;
    
}