import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmpleadosService {

    
    constructor(
        @InjectModel(Empleado.name)
        private readonly _empleadosModel: Model<Empleado>
    ){}

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const { passwordHashed, password } = this.generateAndCodeClave();
    console.log(password);
    createEmpleadoDto.clave = passwordHashed
    try{
        const empleado = await this._empleadosModel.create(createEmpleadoDto);
        
        return empleado;
    }catch(err){
        if (err === 11000){
            throw new BadRequestException(`Can't create empleado because exists in DB`);
        }else {
            throw new InternalServerErrorException(`Can't create empleado - Check logs in server`);
        }
    }
  }

  async findAll() {
    return await this._empleadosModel.find({});
  }

  async findOne(id: string) {
    try{
        const empleado = await this._empleadosModel.findById(id);
        return empleado;
    }catch(err){
        throw new NotFoundException(`Empleado with id ${id} not found`);
    }
  }

  async update(id: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    try{
        const empleado = await this._empleadosModel.findByIdAndUpdate(id, updateEmpleadoDto);
        if (!empleado){
            throw new NotFoundException(`Empleado with id ${id} not found`);
        }
        return updateEmpleadoDto;
    }catch( err ){
        throw new InternalServerErrorException(`Can't update empleado - Check logs in server`);
    }
  }

  async remove(id: string) {
    try{
        const empleado = this._empleadosModel.findByIdAndDelete(id);
        return empleado;
    }catch (err){
        throw new InternalServerErrorException(`Can't remove empleado - Check logs in server`);
    }
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
