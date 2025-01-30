import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AddPrintFilesDto {
  @IsInt()
  @IsNotEmpty()
  printRequestId: number;

  @IsString()
  @IsNotEmpty()
  cloud_address: string; // Cloudinary URL

  @IsInt()
  copies: number;

  @IsString()
color: string;

@IsString()
front_back: string;
}
