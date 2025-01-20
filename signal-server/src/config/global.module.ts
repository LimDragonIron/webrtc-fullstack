import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '.';
import { validate } from './env-schema';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';
import { LoggerModule } from "./logger.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/env/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: configuration,
      validate,
      expandVariables: true,
    }),
    LoggerModule.register(),
    PrismaModule.forRoot(),
    RedisModule.forRoot(),
  ],
})
export class GlobalModule {}
