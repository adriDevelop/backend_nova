import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename } from 'path';
import { Auth } from 'src/auth/entities/auth.entity';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get(':term')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('term') term: string) {
    return this.empleadosService.findOne(term);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ) {
    return this.empleadosService.update(id, updateEmpleadoDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateGerente(
    @Param('id') id: string,
    @Body('gerente') gerente: boolean,
    @Body('idTienda') idTienda: string
  ){
    return this.empleadosService.uploadGerente(id, idTienda, gerente);
  }

  @Patch(':id/:nombre')
  @UseGuards(AuthGuard('jwt'))
  updateClave(
    @Param('id') id: string,
    @Param('nombre') nombre: string,
    @Body('clave') clave: string,
    @Body('claveAntigua') claveAntigua: string,
  ) {
    return this.empleadosService.updatePassword(id, claveAntigua, clave);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
        filename: (req, file, callback) => {
            const nameOriginal = basename(file.originalname.trim());
            const nombreEditado = `${nameOriginal}.png`;
            callback(null, nombreEditado);
        },
        destination: "./upload/empleado",
    })
  }))
  uploadImagen(@UploadedFile() file: Express.Multer.File, @Body() id: string) {
    return this.empleadosService.uploadFile(id, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(id);
  }
}
