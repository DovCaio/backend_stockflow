import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/Product';
import { PrismaService } from '../prisma/prisma.service';

//import { Historic } from '@prisma/client';

import { Query1, Query2, Query3 } from 'src/models/Query1';
import { AlertType, MovementType } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product | null> {
    return this.prisma.product.create({
      data: product,
    });
  }

  async update(id: string, product: Product): Promise<Product | null> {
    const {
      name,
      sku,
      minimumStock,
      currentStock,
      category,
      description,
      price,
    } = product;

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
        price,
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

  async delete(id: string) {
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }

  async getAll(): Promise<Product[] | null> {
    return this.prisma.product.findMany();
  }

  async getQttById(id: string): Promise<{ qtt: number | null | undefined }> {
    const prod = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    return { qtt: prod?.currentStock };
  }

  async putQttById(prodId: string, userId: string, newQtt: number) {
    const prod = await this.prisma.product.findUnique({
      where: {
        id: prodId,
      },
      select: {
        currentStock: true,
        name: true,
        minimumStock: true,
      },
    });

    const updateQtt = await this.prisma.product.update({
      where: {
        id: prodId,
      },
      data: {
        currentStock: newQtt,
      },
    });
    await this.prisma.stockMovement.create({
      data: {
        quantity: newQtt,
        type: MovementType.IN,
        productId: prodId,
        userId: userId,
      },
    });
    const minimumStock = prod?.minimumStock;

    if (!minimumStock) return;

    const alert_type =
      newQtt == 0
        ? AlertType.OUT_OF_STOCK
        : newQtt < minimumStock
          ? AlertType.LOW_STOCK
          : AlertType.NORMAL_STOCK;

    await this.prisma.stockAlert.create({
      data: {
        type: alert_type,
        message: 'A',
        productId: prodId,
      },
    });

    return updateQtt;
  }

  async dashBoardSummary() {
    const totalProducts = await this.prisma.product.count();

    const allProds = await this.prisma.product.findMany();

    const lowStockProducts = allProds.filter((row) => {
      return row.currentStock < row.minimumStock;
    }).length;

    const outOfStockProducts = allProds.filter((row) => {
      return row.currentStock == 0;
    }).length;

    const totalMovements = await this.prisma.stockMovement.count();
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayMovements = await this.prisma.stockMovement.count({
      where: {
        createdAt: {
          gt: startOfDay,
        },
        AND: {
          createdAt: {
            lt: endOfDay,
          },
        },
      },
    });

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalMovements,
      todayMovements,
    };
  }

  async seach(query: Query1) {
    return this.prisma.product.findMany({
      where: {
        AND: [
          { name: { contains: query.search } },
          { category: query.category },
          { alerts: { some: { type: query.stockStatus } } }, //Deveria ser o último alerta registrado, porém o prisma não deixa essa opção, teria que fazer uma consulta sql, porém não acho importante
        ],
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }

  async search2(query: Query2) {
    return this.prisma.product.findMany({
      orderBy: {
        movements: {
          _count: 'desc',
        },
      },
      take: query.limit, 
      include: {
        _count: {
          select: { movements: true },
        },
      },
    });
  }

  async search3(query: Query3) {
    return this.prisma.product.findMany({
      where: {
          alerts : {
            some: { //Mais uma vez a limitação do prisma
              type: query.type
            }
          }
      }
    })
  }
}
