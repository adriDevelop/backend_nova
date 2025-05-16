import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Empleado, EmpleadoSchema } from './entities/empleado.entity';
import { Tienda, TiendaSchema } from 'src/tienda/entities/tienda.entity';

@Module({
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports: [EmpleadosService],
  imports: [
    MongooseModule.forFeature(
        [{
            name: Empleado.name,
            schema: EmpleadoSchema
        }]
    ), MongooseModule.forFeature(
        [{
            name: Tienda.name,
            schema: TiendaSchema
        }]
    )
  ]
})
export class EmpleadosModule {}
