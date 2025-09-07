import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../models/Product';
import { Response } from 'express';
import { Query1 } from '../models/Query1';

@Controller('products')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //crud
  @Post()
  createAproduct(@Body() product: Product) {
    return this.productService.save(product);
  }

  @Put(':id')
  updateAproduct(@Param('id') id: string, @Body() product: Product) {
    return this.productService.update(id, product);
  }

  @Get(':id')
  getAProduct(@Param('id') id: string) {
    return this.productService.get(id);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  //Controle de entrada e saída

  @Get('/dashboard/summary')
  getDashboardSummry() {
    return this.productService.dashBoardSummary();
  }

  @Get('/all')
  getAllWithSearch(@Query('page') query: Query1) {
    return this.productService.seach(query);
  }

  @Get('/qtt/:id')
  getQtt(@Param('id') id: string) {
    return this.productService.getQttById(id);
  }

  @Put('/qtt/:id/:userID/:newqtt')
  putQtt(
    @Param('id') id: string,
    @Param('userID') userID: string,
    @Param('newqtt', ParseIntPipe) newQtt: number,
  ) {
    return this.productService.putQttById(id,userID, newQtt);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAll();
  }
}
