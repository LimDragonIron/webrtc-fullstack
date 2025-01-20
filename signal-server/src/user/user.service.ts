import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomHttpException, HttpErrorCode } from 'src/utils/filters';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async create({
    password,
    ...rest
  }: CreateUserDto): Promise<Pick<User, 'email' | 'name' | 'id'> | null> {

    const existUser = await this.findOneByEmail(rest.email)

    if(existUser) {
      throw new CustomHttpException('This email already exists.', HttpErrorCode.CONFLICT);
    }

    const user = await this.prismaService.user.create({
      data: {
        ...rest,
        password: await this.generateHash(password),
      },
    });

    if (user) {
      return {
        email: user.email,
        name: user.name,
        id: user.id,
      };
    } else {
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
