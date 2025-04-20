import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categoria, CategoriaSchema } from './entities/categoria.entity';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
  imports: [
    MongooseModule.forFeature(
        [{
            name: Categoria.name,
            schema: CategoriaSchema
        }]
    )
  ]
})
export class CategoriasModule {}
