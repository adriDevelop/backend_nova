import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginEmpresaDto } from './dto/login-empresa.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginEmpresa(@Body() loginEmpresaDto: LoginEmpresaDto) {
    return this.authService.loginEmpresa(loginEmpresaDto);
  }

}
