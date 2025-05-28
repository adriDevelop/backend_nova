import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import mongoose, { isValidObjectId, Model, Mongoose, ObjectId, Types } from 'mongoose';
import { InjectModel, ParseObjectIdPipe } from '@nestjs/mongoose';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { Tienda } from 'src/tienda/entities/tienda.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectModel(Empleado.name)
    private readonly _empleadosModel: Model<Empleado>,
    @InjectModel(Tienda.name)
    private readonly _tiendasModel: Model<Tienda>,
    private readonly configService: ConfigService,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const { passwordHashed, password } = this.generateAndCodeClave();
    console.log(password);
    createEmpleadoDto.clave = passwordHashed;

    try {
      const nodemailer = require('nodemailer');

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.PASS_USERNAME,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });

      const empleado = createEmpleadoDto;

      console.log(empleado);

      const tienda = await this._tiendasModel.findById(empleado.id_tienda);

      if (!tienda) {
        throw new Error("Can't find the business to link the employee");
      }


    if (empleado.es_gerente || empleado.es_jefe){
      for (const empleadoTienda of tienda.empleados){
        const empleadoEncontrado = await this._empleadosModel.findById(empleadoTienda);
        if (empleadoEncontrado?.es_gerente || empleadoEncontrado?.es_jefe) {
            throw new Error("No se puede crear este empleado porque ya existe un gerente");
        }
      }
    }

    const empleadoCreado = await this._empleadosModel.create(createEmpleadoDto);

    let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: empleado.email,
        subject: 'Aquí tienes tus credenciales de acceso',
        text: `Email: ${empleado.email}, Clave: ${password}`,
      };

      if (!empleado) {
        throw new Error("Can't create employee in DB");
      }

     await tienda.updateOne({ $push: { empleados: empleadoCreado._id } });
     await tienda.updateOne({ encargado: empleadoCreado._id});
    
      console.log(tienda);

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log(`Error ${err}`);
        } else {
          console.log('Mail sent correctly');
        }
      });

      return empleado;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new BadRequestException(
          `El empleado ya existe en la base de datos`,
        );
      } else {
        console.error(err);
      }
    }
  }

  async findAll() {
    return await this._empleadosModel.find({});
  }

  async findOne(term: string) {
    let empleado: Empleado | null = null;

    if (isValidObjectId(term)) {
      empleado = await this._empleadosModel.findById(term);
    } else if (empleado == null) {
      empleado = await this._empleadosModel.findOne({ email: term });
    } else if (empleado == null) {
      empleado = await this._empleadosModel.findOne({ nombre: term });
    }

    if (!empleado) {
      throw new NotFoundException(
        `No se ha encontrado un empleado con ${term}`,
      );
    }

    return empleado;
  }

  async update(id: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    try {
      const empleado = await this._empleadosModel.findByIdAndUpdate(
        id,
        updateEmpleadoDto,
      );
      if (!empleado) {
        throw new NotFoundException(`Empleado with id ${id} not found`);
      }
      return updateEmpleadoDto;
    } catch (err) {
      throw new InternalServerErrorException(
        `Can't update empleado - Check logs in server`,
      );
    }
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    try {
      if (file.mimetype != 'image/png') {
        throw new TypeError('This image has´t have the correct type');
      }

      if (!isValidObjectId(id)){
        throw new TypeError('Can´t find employee');
      }

      const empleado = this._empleadosModel.findById(new Types.ObjectId(id));

      if (!empleado) {
        throw new NotFoundException('No se ha encontrado al empleado');
      }

      empleado.updateOne({imagen: file.filename});

      return empleado;
    } catch (err) {
        console.error;
    }
  }

  async updatePassword(id: string, claveAntigua: string, clave: string) {
    try {
      const hash = bcrypt.hashSync(clave, 10);

      const empleadoActualizar = await this._empleadosModel.findOne({
        _id: id,
      });

      if (!empleadoActualizar) {
        throw new NotFoundException('No se ha encontrado al empleado');
      }

      if (bcrypt.compareSync(claveAntigua, empleadoActualizar.clave)) {
        const empleado = await this._empleadosModel.findOneAndUpdate(
          { _id: id },
          { clave: hash },
          { new: true }, // retorna el documento actualizado
        );

        if (!empleado) {
          throw new NotFoundException('No se ha encontrado un empleado');
        }

        return empleado;
      }
    } catch (err) {
      console.error('Error al actualizar clave:', err);
      throw new InternalServerErrorException(
        "Can't update password - Check error logs",
      );
    }
  }

  async remove(id: string) {
    try {
        
      const empleado= await this._empleadosModel.findByIdAndDelete(id);

      if (!empleado){
        throw new NotFoundException("No se ha encontrado al empleado con ese id");
      }

      const tienda = await this._tiendasModel.findByIdAndUpdate( 
        {_id: empleado.id_tienda},
        { $pull: {empleados: empleado._id} }
      )

      if (!tienda){
        throw new NotFoundException("No se ha podido eliminar al empleado de la tienda")    
      }

      return empleado;
    } catch (err) {
      throw new InternalServerErrorException(
        `Can't remove empleado - Check logs in server`,
      );
    }
  }

  // Metodo que genera la clave y la cifra
  private generateAndCodeClave() {
    // Genero la clave de la empresa
    let password = generate({
      length: 10,
      numbers: true,
    });

    // Y la hasheo
    const passwordHashed = bcrypt.hashSync(password, 10);

    return { passwordHashed, password };
  }
}
