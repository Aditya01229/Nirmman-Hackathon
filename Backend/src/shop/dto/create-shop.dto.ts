import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAboutDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    phn_number: string;

    @IsNotEmpty()
    @IsString()
    email : string;

    @IsNotEmpty()
    @IsString()
    password : string;
}