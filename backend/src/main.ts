

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { LinkedInService } from './scraper/linkedin/linkedin.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // const appService = new LinkedInService();
  // await appService.test();
}
bootstrap();
