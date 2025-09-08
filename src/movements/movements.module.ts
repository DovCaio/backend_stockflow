import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [MovementsService],
  controllers: [MovementsController],
  imports:  [PrismaModule]
})
export class MovementsModule {}
