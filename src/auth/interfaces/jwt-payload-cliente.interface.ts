import { ObjectId } from 'mongoose';

export interface JwtPayloadCliente {
    id: string,
    nombre: string,
    apellidos: string,
    email: string
}