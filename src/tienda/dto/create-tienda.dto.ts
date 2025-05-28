import { IsArray, IsMongoId, IsObject, isString, IsString, ValidateNested } from 'class-validator';
import ObjectId from 'mongoose';


export class CreateTiendaDto {

    @IsString()
    direccion: string;

    @IsString()
    encargado: string;

    @IsArray()
    empleados: string[];

    @IsArray()
    productos: string[];
}
