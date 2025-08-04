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
  const product1 = { nome: 'Caneta Azul', SKU: 'CAN-AZ-001', qttMin: 10 };
  const product2 = {
    nome: 'Caderno 100 folhas',
    SKU: 'CAD-100-002',
    qttMin: 5,
  };
  const product3 = { nome: 'Lápis HB', SKU: 'LAP-HB-003', qttMin: 20 };
  const product4 = { nome: 'Borracha branca', SKU: 'BOR-BR-004', qttMin: 15 };
  const product5 = { nome: 'Mochila escolar', SKU: 'MOC-ESC-005', qttMin: 3 };
  const ids: number[] = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.product.deleteMany();

    await prisma.$disconnect();
    await app.close();
  });

  describe('CRUD', () => {
    it('/product (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/product')
        .send(product1)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.nome).toBe(product1.nome);
          expect(response.body.SKU).toBe(product1.SKU);
          expect(response.body.qttMin).toBe(product1.qttMin);
          ids.push(response.body.id as number);
        });
    });

    it('/product (PUT)', async () => {
      return await request(app.getHttpServer())
        .put(`/product/${ids[0]}`)
        .send(product2)

        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.id).toBe(ids[0]);
          expect(response.body.nome).toBe(product2.nome);
          expect(response.body.SKU).toBe(product2.SKU);
          expect(response.body.qttMin).toBe(product2.qttMin);
        });
    });

    it('/product (GET)', async () => {
      return await request(app.getHttpServer())
        .get(`/product/${ids[0]}`)

        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.id).toBe(ids[0]);
          expect(response.body.nome).toBe(product2.nome);
          expect(response.body.SKU).toBe(product2.SKU);
          expect(response.body.qttMin).toBe(product2.qttMin);
        });
    });

    it('/product (DELETE)', async () => {
      return await request(app.getHttpServer())
        .delete(`/product/${ids[0]}`)

        .expect(204);
    });
  });

  describe('Controle de entrada e saída', () => {

    beforeAll(async () => {
      const prod = await prisma.product.create({
        data: product3
      })

      ids.push(prod.id)
      
    })

    it('/product (GET) ALL', async () => {
      return await request(app.getHttpServer())
        .get(`/product`)
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(1);
        });
    });

    it('/product/qtt-min (GET) pegar a quantidade de um produto apartir do id', async () => {
      console.log("AQUIIIIII", ids)
      return await request(app.getHttpServer())
        .get(`/product/qtt-min/${ids[1]}`)
        .expect(200)
        .then((response) => {
          expect(response.body.qttMin).toBe(product3.qttMin);
        });
    });

    it('/product/historic (GET) pega o último valor do historico', async () =>{
      return await request(app.getHttpServer())
        .get(`/product/historic`)
        .expect(200)
        .then((response) => {
          const lastHistoric = response.body.length - 1
          expect(response.body.length).toBe(1)
          expect(response.body[lastHistoric].message).toBe(`Pega a quantidade de produtos do ${product3.nome} que era ${product3.qttMin}`);
        });
    })
    it('/product/qtt-min (PUT) mudar a quantidade de um produto apartir do id', async () => {
      return await request(app.getHttpServer())
        .put(`/product/qtt-min/${ids[1]}`)
        .send({ qttMin: 5 })
        .expect(200)
        .then((response) => {
        
          expect(response.body.qttMin).toBe(5);
        });
    });


    it('/product/historic (GET) pega o último valor do historico', async () =>{
      return await request(app.getHttpServer())
        .get(`/product/historic`)
        .expect(200)
        .then((response) => {
          const lastHistoric = response.body.length - 1
          expect(response.body.length).toBe(2)
          expect(response.body[lastHistoric].message).toBe(`Alterada a quantidade de produtos do ${product3.nome} que era ${product3.qttMin} para ${5}`);
        });
    })

  });
});
