import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Empleado extends Document {

    @Prop({
        unique: true,
        index: true
    })
    nuss: string;

    @Prop()
    nombre: string;

    @Prop()
    apellidos: string;

    @Prop()
    telefono: string;

    @Prop()
    imagen: string;

    @Prop({
        unique: true,
        index: true
    })
    email: string

    @Prop()
    clave: string;

    @Prop()
    direccion: string;

    @Prop()
    fecha_alta: number;

    @Prop()
    es_jefe: boolean;

    @Prop()
    es_gerente: boolean;

    @Prop()
    id_tienda: string;
}

export const EmpleadoSchema = SchemaFactory.createForClass(Empleado);
