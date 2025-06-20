import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { ReservaResolver } from './reserva.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  providers: [ReservaResolver, ReservaService],
})
export class ReservaModule {}
