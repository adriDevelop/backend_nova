import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Empresa } from './interfaces/empresas.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
        try{
            const empresa = await this.empresaModel.create(createEmpresaDto);
            return empresa;
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
}
