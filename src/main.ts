import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Run app
  const PORT = process.env.PORT || 1111;
  await app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
  });
}
bootstrap();
