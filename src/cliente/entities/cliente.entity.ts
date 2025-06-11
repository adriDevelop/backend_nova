import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

@Schema()
export class Cliente {

    @Prop()
    @IsString()
    nombre: string;

    @Prop()
    @IsString()
    apellidos: string;

    @Prop()
    @IsDateString()
    fecha_nacimiento: Date;

    @Prop({
        unique: true,
        index: true
    })
    @IsEmail()
    email: string;

    @Prop()
    @IsString()
    password: string;

    @Prop()
    @IsString()
    imagen: string;

    @Prop()
    @IsString()
    carrito: string[];

}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);