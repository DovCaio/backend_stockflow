import { MovementType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class Moviment {
  @IsEnum(MovementType)
  type: MovementType;
  @IsInt()
  quantity: number;
  @IsString()
  @IsOptional()
  note: string;
  @IsString()
  userId: string; //Precisa disso também para criar a movimentação do jeito que ta la no schema
}
