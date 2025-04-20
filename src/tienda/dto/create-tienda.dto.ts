import { IsArray, IsString } from 'class-validator';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Producto } from 'src/producto/entities/producto.entity';

export class CreateTiendaDto {

    @IsString()
    direccion: string;

    @IsString()
    encargado: Empleado

    @IsArray()
    empleados: Empleado[]

    @IsArray()
    productos: Producto[]
}
