import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { AuthGuard } from '@nestjs/passport';
import { fileURLToPath } from 'url';
import { diskStorage, Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { basename } from 'path';

@Controller('tienda')
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTiendaDto: CreateTiendaDto) {
    return this.tiendaService.create(createTiendaDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.tiendaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiendaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateTiendaDto: UpdateTiendaDto) {
    return this.tiendaService.update(id, updateTiendaDto);
  }


  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage ({
        filename: (req, file, callback) => {
            const nameOriginal = basename(file.originalname.trim());
            const nombreEditado = `${nameOriginal}.png`;
            callback(null, nombreEditado);
        },
        destination: "./upload/tienda",
    })
  }))
  uploadImagen(@UploadedFile() file: Express.Multer.File, @Body() id: string){
    return this.tiendaService.uploadImage(id, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.tiendaService.remove(id);
  }
}
