import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRestaurantDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}