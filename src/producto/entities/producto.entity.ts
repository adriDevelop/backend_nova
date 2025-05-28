import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Schema()
export class Producto extends Document{

    @Prop({
        unique: true,
        index: true
    })
    nombre: string;

    @Prop()
    categorias: ObjectId[];

    @Prop()
    cantidad: number;

    @Prop()
    precioUnitario: number;

    @Prop()
    tiendas: ObjectId[];

    @Prop()
    imagen: string;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);