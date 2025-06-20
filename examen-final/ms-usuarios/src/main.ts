import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { CustomLoggerService } from './common/logger/logger.service';

import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);
  
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  if (configService.get('API_DOC_ENABLED') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('Auth')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document);
  }

  const port = configService.get('PORT');
  await app.listen(port || 8000);
  logger.log(`API is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
