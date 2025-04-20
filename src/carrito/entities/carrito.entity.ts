import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Carrito {
    @Prop()
    productos: string[]

    @Prop()
    precio_total: number
}

export const CarritoSchema = SchemaFactory.createForClass(Carrito);
