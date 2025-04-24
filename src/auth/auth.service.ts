import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginEmpresaDto } from './dto/login-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from 'src/empresas/interfaces/empresas.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService { 

    constructor(
        @InjectModel(Empresa.name)
        private readonly empresaModel: Model<Empresa>,
        private readonly jwtService: JwtService
    ){}
    

    async loginEmpresa(loginEmpresaDto: LoginEmpresaDto){
        
        const { clave, cif } = loginEmpresaDto;

        const empresa = await this.empresaModel.findOne({
            cif:cif
        });

        if (!empresa){
            throw new NotFoundException(`La empresa con cif ${cif} no ha sido encontrada`);
        }

        if ( !bcrypt.compareSync( clave, empresa.clave ) ){
            throw new UnauthorizedException('Las credenciales introducidas no son validas');
        }

        return {cif: empresa.cif, nombre: empresa.nombre, token: this.getJWtToken({cif: empresa.cif, nombre: empresa.nombre})};

    }

    private getJWtToken( payload : JwtPayload){
        
        const token = this.jwtService.sign( payload );
        return token;

    }

}
