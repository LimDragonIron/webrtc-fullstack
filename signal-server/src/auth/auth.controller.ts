import { Controller, Request, Post, UseGuards, InternalServerErrorException, Body, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseBuilder } from 'src/utils/response/response-builder';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
  
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        if(!req.user) {
            throw new InternalServerErrorException()
        }

        const loginResult = await this.authService.login(req.user)
        const { data, message, code, meta } = ResponseBuilder.OK_WITH(loginResult)
        return {
            data,
            message,
            code,
            meta
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
