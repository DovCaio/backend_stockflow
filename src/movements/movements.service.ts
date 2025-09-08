import { Injectable } from '@nestjs/common';
import { Query4 } from '../models/Query1';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(query: Query4) {
    const filters: any = {
      AND: [
        query.productId ? { productId: query.productId } : {},
        query.dateFrom ? { createdAt: { gte: new Date(query.dateFrom) } } : {},
        query.dateTo ? { createdAt: { lte: new Date(query.dateTo) } } : {},
        query.type ? { type: query.type } : {},
      ],
    };

    if (query.search) {
      filters.AND.push({ product: { name: { contains: query.search } } });
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: filters,
      skip: (query.page - 1) * query.limit,
      take: Number(query.limit),
    });

    return movements;
  }
}
