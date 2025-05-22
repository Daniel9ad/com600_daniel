import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('libros')
export class Libro {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  autor: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  editorial: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  anio: number;

  @Field()
  @Column({ type: 'text' })
  descripcion: string;

  @Field(() => Int)
  @Column({ type: 'int', name: 'numero_pagina' })
  numeroPagina: number;
}
