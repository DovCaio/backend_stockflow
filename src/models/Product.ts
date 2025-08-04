import { IsInt, IsString } from "class-validator";


export class Product {

    @IsString()
    nome: string;
    @IsString()
    SKU: string;
    @IsInt()
    qttMin: number;

}