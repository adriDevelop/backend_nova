import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';


export class CreateTiendaDto {

    @IsString()
    direccion: string;

    @IsString()
    encargado: string

    @IsArray()
    empleados: string[]

    @IsArray()
    productos: string[]
}
