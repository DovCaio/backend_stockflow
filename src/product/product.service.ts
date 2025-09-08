import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/Product';
import { PrismaService } from '../prisma/prisma.service';
import { logsPatherns } from '../utils/logs-pathern';
import { Historic } from '@prisma/client';
import { Response } from 'express';
import { Parser } from 'json2csv';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product | null> {
    return this.prisma.product.create({
      data: product,  
    });
  }

  async update(id: number, product: Product): Promise<Product | null> {
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

  async get(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(id: number): Promise<Product | null> {

    await this.prisma.historic.deleteMany({
      where: {
        productId: id
      }
    })

    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async getAll(): Promise<Product[] | null> {
    return this.prisma.product.findMany();
  }


  async getQttById(id: number) : Promise<{qtt: number | null | undefined}> {

    const prod = await this.prisma.product.findUnique({
        where: {
            id
        }
    })

    this.createNewHistoric(id, logsPatherns("get", {nome: prod?.name, currentStock:prod?.minimumStock}))

    return {qtt: prod?.currentStock}
  }

  async putQttById(prodId: number, newQtt: number){

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

    this.createNewHistoric(prodId, logsPatherns("update", {nome: prod?.name, currentStock: prod?.currentStock, newQtt}))

    return updateQtt

  }

  //Histórico

  private async createNewHistoric(prodId:number, log : string) : Promise<any | null>{


    const prod = await this.prisma.product.findUnique({
    where: { id: prodId },
    select: { currentStock: true } // mais leve
  });

  if (!prod) return null;

  const historic = await this.prisma.historic.create({
    data: {
      log,
      productId: prodId,
      currentStock: prod.currentStock,
      
    }
  });

  return historic;
  } 

  async getProductHistorics(prodId: number) : Promise<Historic[] | null>{

    return this.prisma.historic.findMany({
      where: {
        productId : prodId
      }
    })

  }

  //Exportação de histórico

  async exportHistoricJson(prodId:number, res: Response) {

    const historic = await this.getProductHistorics(prodId)
    const jsonBuffer = Buffer.from(JSON.stringify(historic, null,2), 'utf-8')

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="historic-${prodId}.json"`,
      'Content-Length': jsonBuffer.length,
    });
    return res.send(jsonBuffer)

  }

  async exportHistoricCsv(prodId:number, res: Response) {

    const historic = await this.getProductHistorics(prodId)
    const parse = new Parser({header: true})
    const csv = parse.parse(historic)

    const buffer = Buffer.from(csv, "utf-8")
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="historic-${prodId}.csv"`,
      'Content-Length': buffer.length,
    });
    return res.send(buffer)

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

    const totalMovements = await this.prisma.historic.count()
    const today = new Date()
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);


    const todayMovements = await this.prisma.historic.count(
      {
        where: {
          creatAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }  
      }
    )
    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalMovements,
      todayMovements
    }
  }
}
