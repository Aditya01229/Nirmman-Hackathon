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

  @IsBoolean()
  color: boolean;

  @IsBoolean()
  front_back: boolean;
}
