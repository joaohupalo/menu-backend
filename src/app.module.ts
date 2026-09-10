import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './cases/categories/category.module';
import { ProductModule } from './cases/products/product.module';
import { SpotModule } from './cases/spots/spot.module';
import { GuestCheckModule } from './cases/guest-checks/guest-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const databaseSchema = configService.get<string>('DATABASE_SCHEMA', 'public');
        
        if(!databaseUrl) {
          throw new Error('A variavel de ambiente DATABASE_URL não foi encontrada');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          schema: databaseSchema,
          autoloadEntities: true,
          synchronize: true,
          
        }
      }
    }),
    CategoryModule,
    ProductModule,
    SpotModule,
    GuestCheckModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}