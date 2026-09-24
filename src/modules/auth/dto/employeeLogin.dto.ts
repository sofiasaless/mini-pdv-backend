import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EmployeeLoginDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;
}
