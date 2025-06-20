import { CreateReservaInput } from './create-reserva.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateReservaInput extends PartialType(CreateReservaInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
