import { IsInt, IsNotEmpty } from "class-validator";

export class MatchDto{

    @IsInt()
    @IsNotEmpty()
    userAId: number;

    @IsInt()
    @IsNotEmpty()
    userBId: number;

}