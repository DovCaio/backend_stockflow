import { MovementType } from '@prisma/client';
import { IsEnum, IsInt, IsString, IsUUID } from 'class-validator';

export class Moviment {
  @IsEnum(MovementType)
  type: MovementType;
  @IsInt()
  quantity: number;
  @IsString()
  note: string;
  @IsString()
  userId: string; //Precisa disso também para criar a movimentação do jeito que ta la no schema
}
