import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CarritoModule } from './carrito/carrito.module';
import { ClienteModule } from './cliente/cliente.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'upload'),
        serveRoot: '/upload',
        exclude: ['/api(.*)'],
    }),
    EmpresasModule, 
    EmpleadosModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/nova-fin-grado'), 
    TiendaModule, 
    ProductoModule, 
    CategoriasModule, 
    CarritoModule, 
    ClienteModule, 
    AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
