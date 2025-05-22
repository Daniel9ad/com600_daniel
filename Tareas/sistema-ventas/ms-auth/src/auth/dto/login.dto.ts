import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsEmail,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty({ message: 'The email cannot be empty' })
  @IsEmail({}, { message: 'The email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'P@ssw0rd!',
    required: true,
  })
  @IsNotEmpty({ message: 'The password cannot be empty' })
  @IsString({ message: 'The password must be string' })
  password: string;
}