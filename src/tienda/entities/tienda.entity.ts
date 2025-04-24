import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Schema()
export class Tienda extends Document{

    @Prop()
    direccion: string

    @Prop({
        unique: true,
        index: true
    })
    encargado: string

    @Prop()
    empleados: string[]

    @Prop()
    productos: string[]
}

export const TiendaSchema = SchemaFactory.createForClass( Tienda );
