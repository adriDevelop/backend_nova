import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresasController {

    constructor(
        private _empresasService: EmpresasService
    ){}

    @Get()
    getAllEmpresas(){
        return this._empresasService.findAll();
    }

    @Get(":term")
    getEmpresaById(@Param('term') term: string){
        return this._empresasService.findById(term);
    }

    @Post()
    createEmpresa( @Body() createEmpresaDto: CreateEmpresaDto){
        return this._empresasService.createEmpresa(createEmpresaDto);
    }

    @Patch(":id")
    upgradeEmpresa( @Param('id') id:string, @Body() updateEmpresaDto: UpdateEmpresaDto){
        return this._empresasService.updateEmpresa(id, updateEmpresaDto);
    }

    @Delete(":id")
    deleteEmpresa( @Param('id') id: string){
        return this._empresasService.deleteEmpresa(id);
    }

}
