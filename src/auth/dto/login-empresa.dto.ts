import { IsString } from 'class-validator';

export class LoginEmpresaDto {
    @IsString()
    cif: string

    @IsString()
    clave: string
}