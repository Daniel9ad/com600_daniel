import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibroService } from './libro.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @ApiOperation({ summary: 'create' })
  @Post()
  create(@Body() createLibroDto: CreateLibroDto) {
    return this.libroService.create(createLibroDto);
  }

  @ApiOperation({ summary: 'find all' })
  @Get()
  findAll() {
    return this.libroService.findAll();
  }

  @ApiOperation({ summary: 'find one' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libroService.findOne(+id);
  }

  @ApiOperation({ summary: 'update' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibroDto: UpdateLibroDto) {
    return this.libroService.update(+id, updateLibroDto);
  }

  @ApiOperation({ summary: 'delete' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libroService.remove(+id);
  }
}
