import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    const config = new DocumentBuilder()
      .setTitle('Candidate Management API')
      .setDescription('API for managing candidates in recruitment system')
      .setVersion('1.0')
      .addTag('candidates')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger documentation: http://localhost:${port}/api`);
  } catch (error) {
    logger.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
