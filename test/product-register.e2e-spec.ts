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
    name: "Notebook Dell Inspiron 15",
    sku: "NB-DEL-001",
    minimumStock: 5,
    currentStock: 20,
    description: "Notebook Dell Inspiron com Intel i5, 8GB RAM e 256GB SSD.",
    category: "Eletrônicos",
    price: 3599.90
  },
  {
    name: "Mouse Gamer Logitech G502",
    sku: "MOU-LOG-002",
    minimumStock: 10,
    currentStock: 50,
    description: "Mouse gamer com sensor HERO 25K, 11 botões programáveis.",
    category: "Periféricos",
    price: 299.99
  },
  {
    name: "Cadeira Gamer ThunderX3",
    sku: "CAD-THU-003",
    minimumStock: 2,
    currentStock: 8,
    description: "Cadeira ergonômica com ajustes completos e apoio para braços 3D.",
    category: "Móveis",
    price: 1299.00
  },
  {
    name: "Monitor LG Ultrawide 29''",
    sku: "MON-LG-004",
    minimumStock: 3,
    currentStock: 12,
    description: "Monitor LG Ultrawide 29 polegadas, resolução 2560x1080.",
    category: "Eletrônicos",
    price: 1599.50
  },
  {
    name: "Teclado Mecânico Redragon Kumara",
    sku: "TEC-RED-005",
    minimumStock: 7,
    currentStock: 30,
    description: "Teclado mecânico com switches Outemu Blue e iluminação RGB.",
    category: "Periféricos",
    price: 249.90
  }
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
    await prisma.historic.deleteMany();
    await prisma.product.deleteMany();

    await prisma.$disconnect();
    await app.close();
  });
    const ids : number[] = []

  describe('CRUD', () => {
    it('/product (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/product')
        .send(products[0])
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe(products[0].name);
          expect(response.body.sku).toBe(products[0].sku);
          expect(response.body.minimumStock).toBe(products[0].minimumStock);
          expect(response.body.currentStock).toBe(products[0].currentStock);
          ids.push(response.body.id as number);
        });
    });

    it('/product (PUT)', async () => {
      return await request(app.getHttpServer())
        .put(`/product/${ids[0]}`)
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
        .get(`/product/${ids[0]}`)

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
        .delete(`/product/${ids[0]}`)

        .expect(204);
    });
  });

  describe('Controle de entrada e saída', () => {

    beforeAll(async () => {
      const prod = await prisma.product.create({
        data: products[2]
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

    it('/product/qtt (GET) pegar a quantidade de um produto apartir do id', async () => {
      return await request(app.getHttpServer())
        .get(`/product/qtt/${ids[1]}`)
        .expect(200)
        .then((response) => {
          expect(response.body.qtt).toBe(products[2].currentStock);
        });
    });

    it('/product/historic (GET) pega o último valor do historico', async () =>{
      return await request(app.getHttpServer())
        .get(`/product/historic/${ids[1]}`)
        .expect(200)
        .then((response) => {
          const lastHistoric = response.body.length - 1
          expect(response.body.length).toBe(1)
          expect(response.body[lastHistoric].log).toBe(`Recuperado o produto ${products[2].name} com a quantidade ${products[2].minimumStock}`);
        });
    })
    it('/product/qtt (PUT) mudar a quantidade de um produto apartir do id', async () => {
      return await request(app.getHttpServer())
        .put(`/product/qtt/${ids[1]}/30`)
        .expect(200)
        .then((response) => {
        
          expect(response.body.currentStock).toBe(30);
        });
    });


    it('/product/historic (GET) pega o último valor do historico de um produto, tem que ter sido alterado', async () =>{
      return await request(app.getHttpServer())
        .get(`/product/historic/${ids[1]}`)
        .expect(200)
        .then((response) => {
          const lastHistoric = response.body.length - 1
          expect(response.body.length).toBe(2)
          expect(response.body[lastHistoric].log).toBe(`Alterado o produto ${products[2].name} com a quantidade ${products[2].currentStock} para ${30}`);
        });
    })

  });

  describe("Exportacao de histórico", () => {

    it("/product/{id}/historic/export/json (GET) deve baixar o histórico do produto em json", async () => {
      const response = await request(app.getHttpServer())
        .get(`/product/${ids[1]}/historic/export/json`)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect('Content-Disposition', `attachment; filename="historic-${ids[1]}.json"`);

      expect(response.text).toContain(`"productId": ${ids[1]}`)
      //Caberia colocar mais testes sobre o hitórico aqui.
    })

    it("/product/{id}/historic/export/csv (GET) deve baixar o histórico do produto em csv", async () => {
      const response = await request(app.getHttpServer())
        .get(`/product/${ids[1]}/historic/export/csv`)
        .buffer(true)
        .parse((res, callback) => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          callback(null, data);
        });
      })
        .expect(200)
        .expect("Content-Type", /text\/csv/)
        .expect('Content-Disposition', `attachment; filename="historic-${ids[1]}.csv"`);
      expect(response.body).toMatch("\"id\",\"log\",\"currentStock\",\"creatAt\",\"productId\"") //se tem o head
      expect(response.body).toContain(`Recuperado o produto ${products[2].name} com a quantidade ${products[2].minimumStock}`)
      expect(response.body).toContain(`Alterado o produto ${products[2].name} com a quantidade ${products[2].currentStock} para ${30}`)
      
      //Caberia colocar mais testes sobre o hitórico aqui.
    })

  })
});
