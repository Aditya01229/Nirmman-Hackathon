import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrintRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;
}
