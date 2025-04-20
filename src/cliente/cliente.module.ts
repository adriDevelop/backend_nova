import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema } from './entities/cliente.entity';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
  exports: [ClienteService],
  imports: [
    MongooseModule.forFeature(
        [{
            name: Cliente.name,
            schema: ClienteSchema
        }]
    )
  ]
})
export class ClienteModule {}
