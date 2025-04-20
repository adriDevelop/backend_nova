import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tienda } from './entities/tienda.entity';
import { Model } from 'mongoose';

@Injectable()
export class TiendaService {

    constructor(
        @InjectModel( Tienda.name )
        private readonly tiendaModel: Model<Tienda>
    ){}

  async create(createTiendaDto: CreateTiendaDto) {
    try{
        const tienda = await this.tiendaModel.create(createTiendaDto);
        return tienda;
    }catch (err){
        if (err.code === 11000){
            throw new BadRequestException(`Tienda exists in DB ${JSON.stringify(err.keyValue)}`);
        }
        return err;
    }
  }

  async findAll() {
    return await this.tiendaModel.find({});
  }

  async findOne(id: string) {
    const tienda = await this.tiendaModel.findById(id);
    if (!tienda){
        throw new NotFoundException(`Empresa with id ${id} not found`);
    }

    return tienda;
  }

  async update(id: string, updateTiendaDto: UpdateTiendaDto) {
    try {
        const tienda = await this.tiendaModel.findByIdAndUpdate(id, updateTiendaDto);
        return tienda;
    }catch (err){
        throw new InternalServerErrorException(`Can't update tienda - Check server logs`);
    }
  }

  async remove(id: string) {
    try {
        const tienda = await this.tiendaModel.findByIdAndDelete(id);
        return tienda;
    }catch (err){
        throw new InternalServerErrorException(`Can't delete tienda - Check server logs`);
    }
  }
}
