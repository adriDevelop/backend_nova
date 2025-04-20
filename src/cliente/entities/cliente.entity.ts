import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

@Schema()
export class Cliente {

    @Prop({
        unique: true,
        index: true
    })
    @IsEmail()
    email: string;

}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);