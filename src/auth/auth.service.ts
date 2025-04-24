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

        let empleados: Empleado[] = [];
        
        const { clave, cif, email } = loginEmpresaDto;

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
            console.log(tiendaDB);
            for (const empleado of tiendaDB.empleados) {
                const empleadoBD = await this.empleadoModel.findById(empleado);
                console.log(empleadoBD);
                if (!empleadoBD) {
                    throw new NotFoundException('No se ha encontrado un empleado con ese id');
                }
                empleados.push(empleadoBD);
            }
        }
        // Recorro el array de empleados para obtener el empleado con el email proporcionado
        const empleado = this.compruebaClaveEmpleados(empleados, email, clave);

        return {cif: empresa.cif, nombre: empresa.nombre, empleados: empleados, token: this.getJWtToken({cif: empresa.cif, nombre: empleado?.nombre, email: empleado?.email})};

    }

    private getJWtToken( payload : JwtPayload){
        
        const token = this.jwtService.sign( payload );
        return token;

    }

    private compruebaClaveEmpleados(empleados: Empleado[], email: string, clave: string): Empleado | void {
        empleados.find(empleado => {
            if (empleado.email == email) {
                if (!bcrypt.compareSync(clave, empleado.clave)) {
                    throw new UnauthorizedException('Las credenciales introducidas no son validas');
                }
                return empleado;
            }
    });
    }   

}
