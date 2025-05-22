import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  
  app.setGlobalPrefix('api/v1');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // if (configService.get('API_DOC_ENABLED') === 'true') {
  //   const config = new DocumentBuilder()
  //     .setTitle('API')
  //     .setDescription('Auth')
  //     .setVersion('1.0')
  //     .addBearerAuth()
  //     .build();
  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup('api/v1/docs', app, document);
  // }

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get('PORT');
  await app.listen(port || 8000);
  logger.log(`API is running on: ${await app.getUrl()}`);
}
bootstrap();
