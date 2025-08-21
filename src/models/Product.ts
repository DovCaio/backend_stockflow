import { IsInt, IsNumber, IsString } from 'class-validator';

export class Product {
  @IsString()
  name: string;
  @IsString()
  sku: string;
  @IsInt()
  minimumStock: number;
  @IsInt()
  currentStock: number;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number
}
