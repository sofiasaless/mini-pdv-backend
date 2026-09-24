import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateEnterpriseDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}