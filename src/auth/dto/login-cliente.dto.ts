import { IsString } from 'class-validator';

export class LoginClienteDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;
}