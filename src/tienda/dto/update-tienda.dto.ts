import { PartialType } from '@nestjs/mapped-types';
import { CreateTiendaDto } from './create-tienda.dto';

export class UpdateTiendaDto extends PartialType(CreateTiendaDto) {}
