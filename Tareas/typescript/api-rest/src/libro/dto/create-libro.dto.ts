import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  autor: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  editorial: string;

  @IsInt()
  @Min(0)
  anio: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  @Min(1)
  numeroPagina: number;
}

