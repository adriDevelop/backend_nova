import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginEmpresaDto } from './dto/login-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from 'src/empresas/interfaces/empresas.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Tienda } from 'src/tienda/entities/tienda.entity';

@Injectable()
export class AuthService { 

    constructor(
        @InjectModel(Empresa.name)
        private readonly empresaModel: Model<Empresa>,
        @InjectModel(Empleado.name)
        private readonly empleadoModel: Model<Empleado>,
        @InjectModel(Tienda.name)
        private readonly tiendaModel: Model<Tienda>,
        private readonly jwtService: JwtService
    ){}
    

    async loginEmpresa(loginEmpresaDto: LoginEmpresaDto){

        try {

            let empleados: Empleado[] = [];
        
        const { clave, cif, emailLogin } = loginEmpresaDto;

        // Recojo la empresa
        const empresa = await this.empresaModel.findOne({
            cif:cif
        });

        if (!empresa){
            throw new NotFoundException(`La empresa con cif ${cif} no ha sido encontrada`);
        }

        // Recojo todas las tiendas y recorro sus empleados para obtenerlos y posteriormente, validar sus claves.
        for (const tienda of empresa.tiendas || []) {
            const tiendaDB = await this.tiendaModel.findById(tienda);
            if (!tiendaDB) {
                throw new NotFoundException('No se ha encontrado la tienda con ese id');
            }
            for (const empleado of tiendaDB.empleados) {
                const empleadoBD = await this.empleadoModel.findById(empleado);
                if (!empleadoBD) {
                    throw new NotFoundException('No se ha encontrado un empleado con ese id');
                }
                empleados.push(empleadoBD);
            }
        }
        // Recorro el array de empleados para obtener el empleado con el email proporcionado
        let empleado = this.compruebaClaveEmpleados(empleados, emailLogin, clave);

        if (!empleado){
            throw new NotFoundException("Las credenciales no son válidas");
        }

        return {cif: empresa.cif, nombre: empresa.nombre, empleados: empleados, token: this.getJWtToken({cif: empresa.cif, email: emailLogin})};

        }catch (err){

            return err;

        }
    }

    private getJWtToken( payload : JwtPayload){
        const token = this.jwtService.sign( payload );
        return token;

    }

    validaJWT(jwt: string) {
        
        try {
            const payload = this.jwtService.verify(jwt);
            return payload; // Retorna el payload si el token es válido
        } catch (err) {
            throw new UnauthorizedException('Token no válido o expirado');
        }
    }

    compruebaClaveEmpleados(empleados: Empleado[], email: string, clave: string): Boolean {
        try{

            empleados.find(empleado => {
                if (empleado.email == email) {
                    if (!bcrypt.compareSync(clave, empleado.clave)) {
                        throw new UnauthorizedException('Las credenciales introducidas no son validas');
                    }
                }
            });

            return true;

        }catch(err){
            return false;
        }
        
    }   

}
