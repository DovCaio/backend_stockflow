import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../models/Product';

@Controller('product')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ProductController {

    constructor (private readonly productService :ProductService ){}


    @Post()
    createAproduct(@Body() product: Product ){

        return this.productService.save(product)
        
    }

    @Put(":id")
    updateAproduct(@Param("id", ParseIntPipe) id: number, @Body() product: Product ){
        return this.productService.update(id, product)
        
    }

    @Get(":id")
    getAProduct(@Param("id", ParseIntPipe) id: number) {
        return this.productService.get(id)
    }


    @Delete(":id")
    @HttpCode(204)
    deleteAProduct(@Param("id", ParseIntPipe) id:number) {
        return this.productService.delete(id)
    }

    

}
