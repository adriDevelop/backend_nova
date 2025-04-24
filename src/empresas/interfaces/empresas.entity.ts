import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Tienda } from 'src/tienda/entities/tienda.entity';

@Schema()
export class Empresa extends Document{

    @Prop({
        unique: true,
        index: true
    })
    cif: string;

    @Prop()
    nombre: string;

    @Prop()
    clave: string;

    @Prop()
    direccion: string

    @Prop({
        unique: true,
        index:true
    })
    telefono: number

    @Prop()
    metodo_pago: string;

    @Prop()
    tiendas?: Tienda[];
}


export const EmpresaSchema = SchemaFactory.createForClass( Empresa );
