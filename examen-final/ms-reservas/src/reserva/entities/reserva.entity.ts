import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('reservas')
export class Reserva {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255, name: 'evento_id' })
  eventoId: string;

  @Field()
  @Column({ type: 'varchar', length: 255, name: 'usuario_id' })
  usuarioId: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaReserva?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaEntrada?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fechaSalida?: Date;

  @Field()
  @Column({ type: 'varchar', length: 255, name: 'estado' })
  estado: string;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_pagar' })
  totalPagar: number;
}
