import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkedInModule } from './scraper/linkedin/linkedin.module';

@Module({
  imports: [LinkedInModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
