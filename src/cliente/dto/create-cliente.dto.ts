import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {

  @IsString()
  nombre: string;

  @IsString()
  apellidos: string;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  carrito: string[];
}
