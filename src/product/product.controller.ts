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
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../models/Product';
import { Response } from 'express';

@Controller('product')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //crud
  @Post()
  createAproduct(@Body() product: Product) {
    return this.productService.save(product);
  }

  @Put(':id')
  updateAproduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: Product,
  ) {
    return this.productService.update(id, product);
  }

  @Get(':id')
  getAProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.get(id);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }

  //Controle de entrada e saída

  @Get()
  getAllProducts(){
    return this.productService.getAll()
  } 


  @Get("/qtt/:id")
  getQtt(@Param("id",ParseIntPipe) id:number){
    return this.productService.getQttById(id)
  }


  @Put("/qtt/:id/:newqtt")
  putQtt(@Param("id",ParseIntPipe) id:number, @Param("newqtt",ParseIntPipe) newQtt: number){
    return this.productService.putQttById(id, newQtt)
  }

  //Histórico

  @Get("/historic/:prodId")
  getProductHistorics(@Param("prodId", ParseIntPipe) id:number){

    return this.productService.getProductHistorics(id);

  }

  //Exportação de hitórico
  
  @Get("/:prodId/historic/export/json")
  async getHistoricJson(@Param("prodId", ParseIntPipe) id:number, @Res() res: Response){
    return this.productService.exportHistoricJson(id, res)
  }

  @Get("/:prodId/historic/export/csv")
  async getHistoricCsv(@Param("prodId", ParseIntPipe) id:number, @Res() res: Response){
    return this.productService.exportHistoricCsv(id, res)
    
  }


}
