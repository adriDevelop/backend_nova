import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { isValidObjectId, Model } from 'mongoose';
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
        this.handleExceptions(err);
    }
  }

  async findAll() {
    return await this._categoriaModel.find({});
  }

  async findOne(term: string) {
        let cat: Categoria | null = null;

        if (isValidObjectId(term)){
            cat = await this._categoriaModel.findById(term);
        }
        
        else if (term) {
            cat = await this._categoriaModel.findOne({nombre: term?.toLowerCase().trim()});
        }

        if (!cat){
            throw new NotFoundException(`No se encuentra una categoria con ese nombre o ese id ${term}`);
        }

        return cat;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try{
        const categoria = await this._categoriaModel.findByIdAndUpdate(id, updateCategoriaDto);
        return categoria;
    }catch (err){
        this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    try{
        const categoria = await this._categoriaModel.findByIdAndDelete(id);
        return categoria;
    }catch (err){
        this.handleExceptions(err);
    }
  }

  private handleExceptions(err: any){
    if ( err.code === 11000){
        throw new BadRequestException(`Can't create categoria because exists in DB`);
    }else {
        throw new InternalServerErrorException(`Can't create categoria - Check error logs`);
    }
  }
}
