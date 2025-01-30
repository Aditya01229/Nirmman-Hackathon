import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCampaignDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    photo?: string;   // URL or file path of the photo

    @IsNotEmpty()
    @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
    amountToBeRaised: number;
}
