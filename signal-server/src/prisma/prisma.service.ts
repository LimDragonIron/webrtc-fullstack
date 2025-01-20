import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/config';
import { format } from 'sql-formatter';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor(protected readonly configService: ConfigService) {
    const datasourceUrl =
      configService.getOrThrow<DatabaseConfig>('database').url;
    super({
      datasourceUrl,
      log: [
          {
              emit: "event",
              level: "query",
          },
          {
            emit: "event",
            level: "error",
          },
          {
            emit: "event",
            level: "info",
          },
          {
            emit: "event",
            level: "warn",
          },
      ],
    });
    this.logger.debug(`datasource Url: ${datasourceUrl}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('error', ({ message }) => {
      this.logger.error(message);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('warn', ({ message }) => {
      this.logger.warn(message);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('info', ({ message }) => {
      this.logger.debug(message);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', ({ query, params }) => {
      this.logger.debug(`${format(query)}\tparams: ${params}`);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  onModuleDestroy() {
    this.$disconnect()
  }
}
