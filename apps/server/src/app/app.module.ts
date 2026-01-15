import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0, // Cache indefinitely (until server restart)
      max: 100, // Maximum number of items in cache
      isGlobal: true, // Make cache available globally
    }),
    CountriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
