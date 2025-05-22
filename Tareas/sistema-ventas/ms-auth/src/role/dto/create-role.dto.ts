import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  MinLength 
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'admin',
    required: true
  })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  @IsString({ message: 'The name must be string' })
  @MaxLength(100, { message: 'The name is very long' })
  @MinLength(2, { message: 'The name is very short' })
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'admin of system',
    required: true
  })
  @IsNotEmpty({ message: 'The description cannot be empty' })
  @IsString({ message: 'The description must be string' })
  @MaxLength(250, { message: 'The description is very long' })
  @MinLength(2, { message: 'The description is very short' })
  description: string;
}
