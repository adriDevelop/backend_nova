import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
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
      const empleado = await this._empleadosModel.create(createEmpleadoDto);

      console.log(empleado);
      const publica = this.configService.get<string>('MJ_APIKEY_PUBLIC')!;
      const privada = this.configService.get<string>('MJ_APIKEY_PRIVATE')!;

      const nodemailer = require('nodemailer');

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.PASS_USERNAME,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });

      let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: empleado.email,
        subject: "Aquí tienes tus credenciales de acceso",
        text: `Email: ${empleado.email}, Clave: ${password}`
      }

      transporter.sendMail(mailOptions, function(err, data){
        if (err){
            console.log(`Error ${err}`);
        }else {
            console.log('Mail sent correctly');
        }
      })

      if (!empleado) {
        throw new Error("Can't create employee in DB");
      }

      const tienda = await this._tiendasModel.findById(empleado.id_tienda);

      if (!tienda) {
        throw new Error("Can't find the business to link the employee");
      }

      await tienda.updateOne({ $push: { empleados: empleado._id } });

      console.log(tienda);
      return empleado;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new BadRequestException(
          `El empleado ya existe en la base de datos`,
        );
      } else {
        console.error(err);
        throw new InternalServerErrorException(`No se pudo crear el empleado`);
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

  async remove(id: string) {
    try {
      const empleado = this._empleadosModel.findByIdAndDelete(id);
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
