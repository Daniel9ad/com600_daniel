import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaInput } from './dto/create-reserva.input';
import { UpdateReservaInput } from './dto/update-reserva.input';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  async create(createReservaDto: CreateReservaInput): Promise<Reserva> {
    const reserva = this.reservaRepository.create(createReservaDto);
    return this.reservaRepository.save(reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find();
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOneBy({ id });
    if (!reserva) {
      throw new NotFoundException(`Reserva con id ${id} no encontrado`);
    }
    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaInput): Promise<Reserva> {
    const reserva = await this.findOne(id);
    const updated = Object.assign(reserva, updateReservaDto);
    return this.reservaRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reservaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Reserva con id ${id} no encontrado`);
    }
  }
}
