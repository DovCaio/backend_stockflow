import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
  const ids : number[] = []

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);

    await prisma.product.deleteMany();
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/product (POST)', () => {
    return request(app.getHttpServer())
      .post('/product')
      .send(product1)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.nome).toBe(product1.nome);
        expect(response.body.SKU).toBe(product1.SKU);
        expect(response.body.qttMin).toBe(product1.qttMin);
        ids.push(response.body.id as number)
      })
      
      
  });


  it('/product (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/product/${ids[0]}`)
      .send(product2)

      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(ids[0]);
        expect(response.body.nome).toBe(product2.nome);
        expect(response.body.SKU).toBe(product2.SKU);
        expect(response.body.qttMin).toBe(product2.qttMin);

      })
      
  });


  it('/product (GET)', () => {
    return request(app.getHttpServer())
      .get(`/product/${ids[0]}`)

      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(ids[0]);
        expect(response.body.nome).toBe(product2.nome);
        expect(response.body.SKU).toBe(product2.SKU);
        expect(response.body.qttMin).toBe(product2.qttMin);

      })
      
  });


  it('/product (PUT)', () => {
    return request(app.getHttpServer())
      .delete(`/product/${ids[0]}`)

      .expect(204)
      
  });

});
