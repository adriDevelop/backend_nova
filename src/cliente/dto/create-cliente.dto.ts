import { IsEmail } from 'class-validator';

export class CreateClienteDto {
    
    @IsEmail()
    email: string;
}
