import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { SeedModule } from './seed/seed.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TiendaModule } from './tienda/tienda.module';

@Module({
  imports: [EmpresasModule, EmpleadosModule, SeedModule, MongooseModule.forRoot('mongodb://localhost:27017/nova-fin-grado'), TiendaModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
