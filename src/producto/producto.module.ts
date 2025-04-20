import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, ProductoSchema } from './entities/producto.entity';

@Module({
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
  imports: [
    MongooseModule.forFeature(
        [{
            name: Producto.name,
            schema: ProductoSchema
        }]
    )
  ]
})
export class ProductoModule {}
