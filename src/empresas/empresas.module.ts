import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, EmpresaSchema } from './interfaces/empresas.entity';

@Module({
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService],
  imports: [
    MongooseModule.forFeature(
        [{
            name: Empresa.name,
            schema: EmpresaSchema 
        }]
    )
  ]
})
export class EmpresasModule {}
