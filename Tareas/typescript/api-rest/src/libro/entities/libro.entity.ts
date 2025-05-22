import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 255 })
  autor: string;

  @Column({ type: 'varchar', length: 255 })
  editorial: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'int', name: 'numero_pagina' })
  numeroPagina: number;
}
