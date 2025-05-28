import { IsArray, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Categoria } from 'src/categorias/entities/categoria.entity';

export class CreateProductoDto {
    
    @IsString()
    nombre: string;

    @IsArray()
    categorias: ObjectId[];

    @IsNumber()
    cantidad: number;

    @IsArray()
    tiendas: ObjectId[];

    @IsNumber()
    precioUnitario: number;
}
