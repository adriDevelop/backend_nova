import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [EmpresasModule, EmpleadosModule, MongooseModule.forRoot('mongodb://localhost:27017/nova-fin-grado'), TiendaModule, ProductoModule, CategoriasModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
