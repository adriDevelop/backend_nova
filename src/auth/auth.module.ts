import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, EmpresaSchema } from 'src/empresas/interfaces/empresas.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Empleado, EmpleadoSchema } from 'src/empleados/entities/empleado.entity';
import { Tienda, TiendaSchema } from 'src/tienda/entities/tienda.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    
    MongooseModule.forFeature(
          [{
              name: Empresa.name,
              schema: EmpresaSchema 
          }]
      ),
      MongooseModule.forFeature(
        [{
            name: Empleado.name,
            schema: EmpleadoSchema
        }]
      ),
      MongooseModule.forFeature(
        [{
            name: Tienda.name,
            schema: TiendaSchema
        }]
      ),
      PassportModule.register({
        defaultStrategy: 'jwt'
      }),
      JwtModule.registerAsync({
        imports: [],
        inject:[],
        useFactory: () => {
            return {
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '2h'
                }
            }
        }
      })
    ],
    exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
 