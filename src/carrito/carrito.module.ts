import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Carrito, CarritoSchema } from './entities/carrito.entity';

@Module({
  controllers: [CarritoController],
  providers: [CarritoService],
  imports: [
    MongooseModule.forFeature(
        [{
            name: Carrito.name,
            schema: CarritoSchema
        }])

  ]
})
export class CarritoModule {}
