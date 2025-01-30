import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAboutDto{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    image?: string;
}