import { IsArray, IsInt, IsString } from 'class-validator';
import { Tienda } from 'src/tienda/entities/tienda.entity';

export class CreateEmpresaDto {
    @IsString()
    cif: string

    @IsString()
    nombre: string;

    @IsString()
    direccion: string;

    @IsInt()
    telefono: number

    @IsString()
    metodo_pago: string

    @IsArray()
    tiendas?: Tienda[];
}