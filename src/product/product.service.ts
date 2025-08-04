import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/Product';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product | null> {
    return this.prisma.product.create({
      data: product,
    });
  }

  async update(id: number, product: Product): Promise<Product | null> {
    const { nome, SKU, qttMin } = product;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        nome,
        SKU,
        qttMin,
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


  async getQttMinById(id: number) : Promise<{qttMin: number | null | undefined}> {



    const prod = await this.prisma.product.findUnique({
        where: {
            id
        }
    })
    return {qttMin: prod?.qttMin}
  }
}
