import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsInt,  IsString } from 'class-validator';
import { CreateEmpresaDto } from './create-empresa.dto';
import { Tienda } from 'src/tienda/entities/tienda.entity';

export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto){

    @IsString()
    cif: string

    @IsString()
    nombre: string;

    @IsString()
    direccion: string

    @IsInt()
    telefono: number

    @IsString()
    metodo_pago: string;

    @IsArray()
    tiendas: Tienda[];
}