import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Product } from '../src/models/Product';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const products: Product[] = [
    {
      name: 'Notebook Dell Inspiron 15',
      sku: 'NB-DEL-001',
      minimumStock: 5,
      currentStock: 20,
      description: 'Notebook Dell Inspiron com Intel i5, 8GB RAM e 256GB SSD.',
      category: 'Eletrônicos',
      price: 3599.9,
    },
    {
      name: 'Mouse Gamer Logitech G502',
      sku: 'MOU-LOG-002',
      minimumStock: 10,
      currentStock: 50,
      description: 'Mouse gamer com sensor HERO 25K, 11 botões programáveis.',
      category: 'Periféricos',
      price: 299.99,
    },
    {
      name: 'Cadeira Gamer ThunderX3',
      sku: 'CAD-THU-003',
      minimumStock: 2,
      currentStock: 8,
      description:
        'Cadeira ergonômica com ajustes completos e apoio para braços 3D.',
      category: 'Móveis',
      price: 1299.0,
    },
    {
      name: "Monitor LG Ultrawide 29''",
      sku: 'MON-LG-004',
      minimumStock: 3,
      currentStock: 12,
      description: 'Monitor LG Ultrawide 29 polegadas, resolução 2560x1080.',
      category: 'Eletrônicos',
      price: 1599.5,
    },
    {
      name: 'Teclado Mecânico Redragon Kumara',
      sku: 'TEC-RED-005',
      minimumStock: 7,
      currentStock: 30,
      description:
        'Teclado mecânico com switches Outemu Blue e iluminação RGB.',
      category: 'Periféricos',
      price: 249.9,
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    //await prisma.historic.deleteMany();
    await prisma.product.deleteMany();
    await prisma.stockAlert.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
    await app.close();
  });
  const ids: string[] = [];

  describe('CRUD', () => {
    it('/product (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/products')
        .send(products[0])
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe(products[0].name);
          expect(response.body.sku).toBe(products[0].sku);
          expect(response.body.minimumStock).toBe(products[0].minimumStock);
          expect(response.body.currentStock).toBe(products[0].currentStock);
          ids.push(response.body.id);
        });
    });

    it('/product (PUT)', async () => {
      return await request(app.getHttpServer())
        .put(`/products/${ids[0]}`)
        .send(products[1])

        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.id).toBe(ids[0]);
          expect(response.body.name).toBe(products[1].name);
          expect(response.body.sku).toBe(products[1].sku);
          expect(response.body.minimumStock).toBe(products[1].minimumStock);
          expect(response.body.currentStock).toBe(products[1].currentStock);
        });
    });

    it('/product (GET)', async () => {
      return await request(app.getHttpServer())
        .get(`/products/${ids[0]}`)

        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.id).toBe(ids[0]);
          expect(response.body.name).toBe(products[1].name);
          expect(response.body.sku).toBe(products[1].sku);
          expect(response.body.minimumStock).toBe(products[1].minimumStock);
          expect(response.body.currentStock).toBe(products[1].currentStock);
        });
    });

    it('/product (DELETE)', async () => {
      return await request(app.getHttpServer())
        .delete(`/products/${ids[0]}`)

        .expect(204);
    });
  });

  describe('Controle de entrada e saída', () => {
    beforeAll(async () => {
      const prod = await prisma.product.create({
        data: products[2],
      });

      ids.push(prod.id);
    });

    it('/product (GET) ALL', async () => {
      return await request(app.getHttpServer())
        .get(`/products`)
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(1);
        });
    });

    it('/product/qtt (GET) pegar a quantidade de um produto apartir do id', async () => {
      return await request(app.getHttpServer())
        .get(`/products/qtt/${ids[1]}`)
        .expect(200)
        .then((response) => {
          expect(response.body.qtt).toBe(products[2].currentStock);
        });
    });

    it('/product/qtt (PUT) mudar a quantidade de um produto apartir do id', async () => {
      return await request(app.getHttpServer())
        .put(`/products/qtt/${ids[1]}/30`)
        .expect(200)
        .then((response) => {
          expect(response.body.currentStock).toBe(30);
        });
    });

    it('Resumo', async () => {
      return await request(app.getHttpServer())
        .get(`/products/dashboard/summary`)
        .expect(200)
        .then((res) => {
          console.log(res.body);
          expect(res.body.totalProducts).toBe(1);
          expect(res.body.lowStockProducts).toBe(0);
          expect(res.body.outOfStockProducts).toBe(0);
          expect(res.body.totalMovements).toBe(2);
          expect(res.body.todayMovements).toBe(2);
        });
    });
  });
});
