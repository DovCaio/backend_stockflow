import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/Product';
import { PrismaService } from '../prisma/prisma.service';

//import { Historic } from '@prisma/client';

import { Query1 } from 'src/models/Query1';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product | null> {
    return this.prisma.product.create({
      data: product,  
    });
  }

  async update(id: string, product: Product): Promise<Product | null> {
    const { name, sku, minimumStock, currentStock, category, description, price} = product;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        sku,
        minimumStock,
        currentStock,
        category,
        description,
        price
      },
    });
  }

  async get(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }


  async delete(id:string)  {
    return this.prisma.product.delete({
      where : {
        id: id
      }
    })
  }

  async getAll(): Promise<Product[] | null> {
    return this.prisma.product.findMany();
  }

 async getQttById(id: string) : Promise<{qtt: number | null | undefined}> {

    const prod = await this.prisma.product.findUnique({
        where: {
            id
        }
    })

    return {qtt: prod?.currentStock}
  }

  async putQttById(prodId: string, newQtt: number){

    const prod = await this.prisma.product.findUnique({
      where : {
        id: prodId
      },
      select : {
        currentStock : true,
        name: true
      }
    })
    

    const updateQtt = await this.prisma.product.update({
      where: {
        id: prodId
      },
      data: {
        currentStock:newQtt                
      }
    }) 


    return updateQtt

  }



  async dashBoardSummary() {


    const totalProducts = await this.prisma.product.count()

    const allProds = await this.prisma.product.findMany()

    const lowStockProducts = allProds.filter((row) => {
      return row.currentStock < row.minimumStock 
    }).length

    const outOfStockProducts = allProds.filter((row) => {
      return row.currentStock == 0
    }).length

    const totalMovements = 2
    const today = new Date()
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);


    const todayMovements = 2
    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalMovements,
      todayMovements
    }
  }

  async seach(query: Query1){
    
  }
}
