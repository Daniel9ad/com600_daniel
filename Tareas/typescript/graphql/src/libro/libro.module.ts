import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { LibroResolver } from './libro.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  providers: [LibroResolver, LibroService],
})
export class LibroModule {}
