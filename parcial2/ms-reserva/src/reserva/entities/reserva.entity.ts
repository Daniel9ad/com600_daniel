import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('reservas')
export class Reserva {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255, name: 'habitacion_id' })
  habitacionId: string;

  @Field()
  @Column({ type: 'varchar', length: 255, name: 'usuario_id' })
  usuarioId: string;

  @Field()
  @Column({ type: 'timestamp', name: 'fecha_reserva' })
  fechaReserva: Date;

  @Field()
  @Column({ type: 'timestamp', name: 'fecha_entrada' })
  fechaEntrada: Date;

  @Field()
  @Column({ type: 'timestamp', name: 'fecha_salida' })
  fechaSalida: Date;

  @Field()
  @Column({ type: 'varchar', length: 255, name: 'estado' })
  estado: string;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_pagar' })
  totalPagar: number;
}
