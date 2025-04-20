import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TiendaController } from './tienda.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tienda, TiendaSchema } from './entities/tienda.entity';

@Module({
  controllers: [TiendaController],
  providers: [TiendaService],
  exports: [TiendaService],
  imports: [
      MongooseModule.forFeature(
          [{
              name: Tienda.name,
              schema: TiendaSchema
          }]
      )
    ]
})
export class TiendaModule {}
