import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LibroService } from './libro.service';
import { Libro } from './entities/libro.entity';
import { CreateLibroInput } from './dto/create-libro.input';
import { UpdateLibroInput } from './dto/update-libro.input';

@Resolver(() => Libro)
export class LibroResolver {
  constructor(private readonly libroService: LibroService) {}

  @Mutation(() => Libro)
  createLibro(@Args('createLibroInput') createLibroInput: CreateLibroInput) {
    return this.libroService.create(createLibroInput);
  }

  @Query(() => [Libro], { name: 'libros' })
  findAll() {
    return this.libroService.findAll();
  }

  @Query(() => Libro, { name: 'libro' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.libroService.findOne(id);
  }

  @Mutation(() => Libro)
  updateLibro(@Args('updateLibroInput') updateLibroInput: UpdateLibroInput) {
    return this.libroService.update(updateLibroInput.id, updateLibroInput);
  }

  @Mutation(() => Boolean)
  async removeLibro(@Args('id', { type: () => Int }) id: number) {
    await this.libroService.remove(id);
    return true;
  }
}
