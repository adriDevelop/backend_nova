import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Producto } from './entities/producto.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductoService {

    constructor(
        @InjectModel( Producto.name )
        private readonly _productosModel: Model<Producto>
    ){}

  async create(createProductoDto: CreateProductoDto) {
    try{
        const producto =  await this._productosModel.create(createProductoDto);
        return producto;
    } catch(err){
        if (err === 11000){
            throw new BadRequestException(`This product exists in DB`);
        }else {
            throw new InternalServerErrorException(`Can't add this product - Check server logs`);
        }
    }
  }

  async findAll() {
    return await this._productosModel.find({});
  }

  async findOne(id: string) {
    const producto = await this._productosModel.findById(id);

    if (!producto) {
        throw new NotFoundException(`Can't find the producto with id ${id}`);
    }

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    try{
        const producto = await this._productosModel.findByIdAndUpdate(id, updateProductoDto);
        return producto;
    }catch (err){
        throw new InternalServerErrorException(`Can't update the product - Check server logs`);
    }
  }

  async uploadFile(id:string, file: Express.Multer.File){
    try{
        if (file.mimetype != 'image/png') {
            throw new TypeError("This image hasn't have the correct type");
        }

        if (!isValidObjectId(id)){
            throw new TypeError("Can't find employee");
        }

        const producto = this._productosModel.findOne(new Types.ObjectId(id));

        if (!producto){
            throw new NotFoundException("Can't find product");
        }

        producto.updateOne({imagen: file.filename + ".png"});

        return producto;
    }catch(err){
        console.error;
    }
  }

  async remove(id: string) {
    try {
        const producto = await this._productosModel.findByIdAndDelete(id);
        return producto;
    } catch (err){
        throw new NotFoundException(`Can't find any product with id ${id}`);
    }
  }
}
