import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Schema()
export class Producto extends Document{

    @Prop({
        unique: true,
        index: true
    })
    nombre: string;

    @Prop()
    categoria: Categoria[];

    @Prop()
    cantidad: number;

    @Prop()
    precioUnitario: number;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);