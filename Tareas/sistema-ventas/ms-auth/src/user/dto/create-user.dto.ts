import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

const passwordRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export class CreateUserDto {
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
  // @Matches(passwordRegEx, {
  //   message: `Password must contain a minimum of 8 characters,
  //   must contain at least one uppercase letter,
  //   must contain at least one lowercase letter,
  //   must contain at least one number,
  //   must contain at least one special character.`,
  // })
  password: string;
}