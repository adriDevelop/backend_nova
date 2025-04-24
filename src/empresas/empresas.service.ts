import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Empresa } from './interfaces/empresas.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmpresasService {

    constructor(
        @InjectModel( Empresa.name )
        private readonly empresaModel: Model<Empresa>
    ){}

    async findAll(){
        const empresas: Empresa[] = await this.empresaModel.find({});
        return empresas;
    }

    async findById(id: string){
       const empresa = isValidObjectId(id) ? await this.empresaModel.findById(id) : await this.empresaModel.findOne({nombre: id});
        if (!empresa){
            throw new NotFoundException(`Empresa with id ${id} not found`);
        }
        return empresa;
    }

    async createEmpresa(createEmpresaDto: CreateEmpresaDto){
        createEmpresaDto.nombre = createEmpresaDto.nombre.toLowerCase();
        const { password, passwordHashed } = this.generateAndCodeClave();
        createEmpresaDto.clave = passwordHashed
        console.log(password);
        
        try{
            const empresa = await this.empresaModel.create(createEmpresaDto);
            const {clave, ...datosEmpresa} = empresa
            return datosEmpresa.$model;
        }
        catch(err){
            if (err.code === 11000){
                throw new BadRequestException(`Empresa exist in DB ${JSON.stringify(err.keyValue)}`);
            }else {
                throw new InternalServerErrorException(`Can't create empresa - Check server logs`);
            }
        }
    }

    async updateEmpresa(id: string, updateEmpresaDto: UpdateEmpresaDto){
        const empresa = await this.findById(id);
    
        if (updateEmpresaDto.nombre){
            updateEmpresaDto.nombre = updateEmpresaDto.nombre.toLowerCase();
        }

        await empresa.updateOne(updateEmpresaDto, {new: true});

        return {...empresa.toJSON(), ...updateEmpresaDto};
    }

    async deleteEmpresa(id: string){
        const empresa = await this.findById(id);

        await empresa.deleteOne();

        return empresa;
    }

    // Metodo que genera la clave y la cifra
    private generateAndCodeClave(){
        
        // Genero la clave de la empresa
        let password = generate({
            length: 10,
            numbers: true
        });

        // Y la hasheo
        const passwordHashed = bcrypt.hashSync(password, 10);


        return {passwordHashed, password};
    }
}
