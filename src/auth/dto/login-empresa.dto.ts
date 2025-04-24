import { IsEmail, IsString } from 'class-validator';

export class LoginEmpresaDto {
    @IsString()
    cif: string

    @IsEmail()
    email: string

    @IsString()
    clave: string
}