import { IsEmail, IsString } from 'class-validator';

export class LoginEmpresaDto {
    @IsString()
    cif: string

    @IsEmail()
    emailLogin: string

    @IsString()
    clave: string
}