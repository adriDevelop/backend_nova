import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Empresa } from 'src/empresas/interfaces/empresas.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectModel(Empresa.name)
        private readonly empresaModel: Model<Empresa>,
    ){
        super({
            secretOrKey: process.env.JWT_SECRET || 'default_secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false
        })
    }

    async validate(payload: JwtPayload): Promise<Empresa> {
        
        // Desestructuramos el payload para generar el JWT
        const {cif, email, nombre, es_gerente, es_jefe} = payload;
        const empresa = await this.empresaModel.findOne({cif: cif});

        if (!empresa){
            throw new UnauthorizedException('Token not valid');
        }

        return empresa;
    }

}