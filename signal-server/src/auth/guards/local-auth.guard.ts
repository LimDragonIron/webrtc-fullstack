import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { LoginDto } from '../dto/login-dto';
import { validate } from 'class-validator';
import { Request, Response } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
    
        const body = plainToClass(LoginDto, request.body);

        const errors = await validate(body);
        
        const errorMessages = errors.flatMap(({ constraints }) =>
          Object.values(constraints).join(', '),
        );
    
        if (errorMessages.length > 0) {
          // return bad request if validation fails
          response.status(HttpStatus.BAD_REQUEST).send({
            code: HttpStatus.BAD_REQUEST,
            data: "",
            error: 'Bad Request',
            message: errorMessages,
          });
        }
    
        return super.canActivate(context) as boolean | Promise<boolean>;
      }
}
