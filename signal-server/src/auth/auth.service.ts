import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CustomHttpException, HttpErrorCode } from 'src/utils/filters';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      email: user.email,
      name: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findOneByEmail(email);
    
    if (!user) {
      throw new CustomHttpException("This account does not exist.", HttpErrorCode.ACCOUNT_NOT_FOUND)
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const result:Omit<User, 'password'>  = {...user} 
    
    if (isMatch) {
      return result
    } else {
      throw new CustomHttpException("Password does not match.", HttpErrorCode.ACCOUNT_PASSWORD_NOT_MATCH)
    }
  }
}
