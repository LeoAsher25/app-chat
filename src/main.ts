import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/public/',
  });

  // Run app
  const PORT = process.env.PORT || 1111;
  await app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
  });
}
bootstrap();
