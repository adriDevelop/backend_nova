import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Model } from 'mongoose';
import { Cliente } from './entities/cliente.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClienteService {

    constructor(
        @InjectModel(Cliente.name)
        private readonly _clienteModel : Model<Cliente>
    ){}

  async create(createClienteDto: CreateClienteDto) {
    try{
        const cliente = await this._clienteModel.create(createClienteDto);
        return cliente;
    }catch(err){
        if (err === 11000){
            throw new BadRequestException(`Can't create cliente because exists in DB`);
        }else {
            throw new InternalServerErrorException(`Can't create cliente - Check server logs`);
        }
    }
  }

  async findAll() {
    const cliente = await this._clienteModel.find({});
    return cliente;
  }

  async findOne(id: string) {
    try{
        const cliente = await this._clienteModel.findById(id);
        return cliente;
    }catch( err ){
        throw new InternalServerErrorException(`Can't find the client - Check server logs`);
    }
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    try{
        const cliente = await this._clienteModel.findByIdAndUpdate(id, updateClienteDto);
        return cliente;
    }catch(err){
        throw new InternalServerErrorException(`Can't update cliente - Check server logs`);
    }
  }

  async remove(id: string) {
    const cliente = await this._clienteModel.findByIdAndDelete(id);
    return cliente;
  }
}
