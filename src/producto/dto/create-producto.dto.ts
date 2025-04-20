import { IsArray, IsNumber, IsString } from 'class-validator';
import { Categoria } from 'src/categorias/entities/categoria.entity';

export class CreateProductoDto {
    
    @IsString()
    nombre: string;

    @IsArray()
    categorias: Categoria[]

    @IsNumber()
    cantidad: number;

    @IsNumber()
    precioUnitario: number;
}
