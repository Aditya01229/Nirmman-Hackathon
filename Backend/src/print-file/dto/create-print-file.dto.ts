import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrintFileDto {
    @IsString()
    @IsNotEmpty()
    cloud_address: string;

    @IsInt()
    copies: number;

    @IsBoolean()
    color?: boolean;

    @IsBoolean()
    front_back?: boolean;

    @IsInt()
    printRequestId: number; // Foreign key reference
}
