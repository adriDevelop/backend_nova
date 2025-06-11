import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginEmpresaDto } from './dto/login-empresa.dto';
import { LoginClienteDTO } from './dto/login-cliente.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginEmpresa(@Body() loginEmpresaDto: LoginEmpresaDto) {
    return this.authService.loginEmpresa(loginEmpresaDto);
  }

  @Post('loginCliente')
  loginCliente(@Body() loginClienteDto: LoginClienteDTO) {
    return this.authService.loginCliente(loginClienteDto);
  }

  @Post('compruebaToken')
  compruebaToken(@Body('jwt') jwt: string){
    return this.authService.validaJWT(jwt);
  }

}
