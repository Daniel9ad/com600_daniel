import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLibroInput } from './dto/create-libro.input';
import { UpdateLibroInput } from './dto/update-libro.input';
import { Libro } from './entities/libro.entity';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async create(createLibroDto: CreateLibroInput): Promise<Libro> {
    const libro = this.libroRepository.create(createLibroDto);
    return this.libroRepository.save(libro);
  }

  async findAll(): Promise<Libro[]> {
    return this.libroRepository.find();
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.libroRepository.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
    return libro;
  }

  async update(id: number, updateLibroDto: UpdateLibroInput): Promise<Libro> {
    const libro = await this.findOne(id);
    const updated = Object.assign(libro, updateLibroDto);
    return this.libroRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.libroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
  }
}
