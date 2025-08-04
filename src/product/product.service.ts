import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/Product';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

    constructor( private readonly prisma: PrismaService){}

    public saveAProducts(product : Product) : Promise<Product | null>{

        return this.prisma.product.create({
            data: product
        })

    }

}
