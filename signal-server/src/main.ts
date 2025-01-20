import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedisIoAdapter } from './chat/redis.adapter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './utils/filters';
import { Logger } from "nestjs-pino"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger)
  app.useLogger(logger)

  app.enableCors();
  app.use(helmet());
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
    }),
)

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  
  const PORT = process.env.PORT || 8080

  logger.log(`> NODE_ENV is ${process.env.NODE_ENV}`)
  logger.log(`> Ready on PORT: ${PORT}`)
  logger.log(
      `> System Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  )
  logger.log(`> Current System Time: ${new Date().toString()}`)

  setSwagger(app)
  await app.listen(PORT);

}

function setSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
      .setTitle("WebRtc Backend Api")
      .setDescription("WebRtc Backend Api Description")
      .setVersion("1.0")
      .addBearerAuth()
      .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("docs", app, document)
}

bootstrap();
