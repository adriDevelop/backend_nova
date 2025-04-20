import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Model } from 'mongoose';
import { Carrito } from './entities/carrito.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CarritoService {

    constructor(
        @InjectModel(Carrito.name)
        private readonly _carritoModel: Model<Carrito>
    ){}

  async create(createCarritoDto: CreateCarritoDto) {
    try{
        const carrito = await this._carritoModel.create(createCarritoDto);
        return carrito;
    }catch(err){
        if (err === 11000){
            throw new BadRequestException(`Can't create carrito because exists in DB`);
        }else {
            throw new InternalServerErrorException(`Cant create carrito - Check logs in server`);
        }
    }
  }

  async findAll() {
    return await this._carritoModel.find({});
  }

  async findOne(id: string) {
    try {
        const carrito = await this._carritoModel.findById(id);
        return carrito;
    }catch(err){
        throw new BadRequestException(`Can't find carrito with id ${id}`);
    }
  }

  async update(id: string, updateCarritoDto: UpdateCarritoDto) {
    try{
        const carrito = await this._carritoModel.findByIdAndUpdate(id, updateCarritoDto);
        return carrito;
    }catch (err){
        throw new InternalServerErrorException(`Can't update carrito`);
    }
  }

  async remove(id: string) {
    const carrito = await this._carritoModel.findByIdAndDelete(id);
    return carrito;
  }
}
