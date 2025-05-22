import { CreateLibroInput } from './create-libro.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateLibroInput extends PartialType(CreateLibroInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
