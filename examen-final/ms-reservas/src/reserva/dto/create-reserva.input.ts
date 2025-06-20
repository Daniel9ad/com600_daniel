import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';

@InputType()
export class CreateReservaInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  eventoId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  usuarioId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fechaReserva: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fechaEntrada: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fechaSalida: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  estado: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  totalPagar: number;
}

