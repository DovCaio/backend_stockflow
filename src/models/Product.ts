import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class Product {
  @IsString()
  @IsOptional()
  id?: string
  @IsString()
  name: string;
  @IsString()
  sku: string;
  @IsInt()
  minimumStock: number;
  @IsInt()
  currentStock: number;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  category?: string | null;

  @IsNumber()
  price: number

  @IsDate()
  @IsOptional()
  createAt?: Date
  @IsDate()
  @IsOptional()
  updateAt?: Date
}
