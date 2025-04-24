import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmpleadoDto {

    @IsString()
    readonly nuss: string;

    @IsString()
    readonly nombre: string;

    @IsString()
    readonly apellidos: string;

    @IsNumber()
    readonly telefono: number;

    @IsString()
    readonly direccion: string;

    @IsEmail()
    email: string;

    @IsOptional()
    clave?: string;

    @IsNumber()
    readonly fecha_alta: number;

    @IsBoolean()
    readonly es_jefe: boolean;

    @IsBoolean()
    readonly es_gerente: boolean;

    @IsString()
    readonly id_tienda?: string;
}
