import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Model } from 'mongoose';
import { Categoria } from './entities/categoria.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel(Categoria.name)
        private readonly _categoriaModel: Model<Categoria>
    ){}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try{
        const categoria = await this._categoriaModel.create(createCategoriaDto);
        return categoria;
    }catch(err){
        if ( err === 11000){
            throw new BadRequestException(`Can't create categoria because exists in DB`);
        }else {
            throw new InternalServerErrorException(`Can't create categoria - Check error logs`);
        }
    }
  }

  async findAll() {
    return await this._categoriaModel.find({});
  }

  async findOne(id: string) {
    try{
        const categoria = await this._categoriaModel.findById(id);
        return categoria;
    }catch (err){
        throw new NotFoundException(`Can't find categoria with id ${id}`);
    }
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try{
        const categoria = await this._categoriaModel.findByIdAndUpdate(id, updateCategoriaDto);
        return categoria;
    }catch (err){
        throw new NotFoundException(`Can't find categoria with id ${id}`);
    }
  }

  async remove(id: string) {
    try{
        const categoria = await this._categoriaModel.findByIdAndDelete(id);
        return categoria;
    }catch (err){
        throw new NotFoundException(`Can't find categoria with id ${id}`);
    }
  }
}
