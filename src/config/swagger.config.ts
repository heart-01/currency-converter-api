import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Currency Exchange API')
    .setDescription("Currency Exchange API's documentation")
    .setVersion('1.0')
    .addServer('api')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('document', app, document, {
    swaggerOptions: {
      explorer: true,
      showRequestDuration: true,
    },
  });
};
