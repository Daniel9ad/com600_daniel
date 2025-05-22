import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';

@InputType()
export class CreateLibroInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  autor: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  editorial: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  anio: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  numeroPagina: number;
}

