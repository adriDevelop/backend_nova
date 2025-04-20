import { IsArray, IsNumber } from 'class-validator';

export class CreateCarritoDto {

    @IsArray()
    productos: string[]

    @IsNumber()
    precio_total: number
}
