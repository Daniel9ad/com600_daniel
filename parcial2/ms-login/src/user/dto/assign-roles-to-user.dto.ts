import { ApiProperty } from '@nestjs/swagger';
import { 
  ArrayMaxSize, 
  ArrayMinSize, 
  ArrayNotEmpty, 
  IsArray, 
  IsNotEmpty, 
  IsUUID 
} from 'class-validator';

export class AssignRolesToUserDto {
  @ApiProperty({
    description: 'IDs of roles',
    example: ['123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174003'],
    required: true,
    type: [String]
  })
  @IsNotEmpty({ message: 'The rolesId cannot be empty' })
  @IsArray({ message: 'rolesId should be an array' })
  @ArrayNotEmpty({ message: 'rolesId should not be an empty array' })
  @ArrayMinSize(1, { message: 'rolesId must have at least one ID' })
  @ArrayMaxSize(100, { message: 'rolesId must have no more than 100 IDs' })
  @IsUUID('4', { each: true, message: 'Each role must be a valid UUID' })
  rolesId: string[];
}
