import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/Product';
import { PrismaService } from '../prisma/prisma.service';
import { logsPatherns } from '../utils/logs-pathern';
@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product | null> {
    return this.prisma.product.create({
      data: product,
    });
  }

  async update(id: number, product: Product): Promise<Product | null> {
    const { nome, SKU, qttMin, qtt } = product;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        nome,
        SKU,
        qttMin,
        qtt
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
    return this.prisma.product.delete({
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

    this.createNewHistoric(id, logsPatherns("get", {nome: prod?.nome, qtt:prod?.qttMin}))

    return {qtt: prod?.qtt}
  }

  //Histórico

  async createNewHistoric(prodId:number, log : string) : Promise<any | null>{


    const prod = await this.prisma.product.findUnique({
    where: { id: prodId },
    select: { qttMin: true } // mais leve
  });

  if (!prod) return null;

  const historic = await this.prisma.historic.create({
    data: {
      log,
      productId: prodId,
      qttMin: prod.qttMin
    }
  });

  return historic;
  } 
}
