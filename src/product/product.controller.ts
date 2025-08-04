import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/models/Product';

@Controller('product')
export class ProductController {

    constructor (private readonly productService :ProductService ){}


    @Post()
    creatAproduct(@Body() product: Product ){

        return this.productService.saveAProducts(product)
        
    }

}
