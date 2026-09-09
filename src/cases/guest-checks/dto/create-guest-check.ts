import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateGuestCheckDto{
    @IsUUID()
    @IsNotEmpty()
    @MaxLength(60)
    spotId: string;
}