import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MovementsModule } from './movements/movements.module';

@Module({
  imports: [ProductModule, PrismaModule, UserModule, MovementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
