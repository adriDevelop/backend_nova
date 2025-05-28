import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsString } from 'class-validator';

@Schema()
export class Cliente {

    @Prop({
        unique: true,
        index: true
    })
    @IsEmail()
    email: string;

    @Prop()
    @IsString()
    imagen: string;

}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);