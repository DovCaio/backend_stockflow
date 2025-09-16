import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { User } from 'src/models/User';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserService } from '../src/user/user.service';
import { ProductService } from '../src/product/product.service';
import { Moviment } from '../src/models/Moviment';
import { MovementType, Role } from '@prisma/client';
import { CreateUserDto } from '../src/models/CreateUserDto';
describe('movementes tests', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let prodService: ProductService;
  let userService: UserService;
  const prodId: string[] = []
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = await app.get(PrismaService);

    prodService = await app.get(ProductService);
    userService = await app.get(UserService);

    const prod = {
      name: "Monitor LG Ultrawide 29''",
      sku: 'MON-LG-044',
      minimumStock: 3,
      currentStock: 12,
      description: 'Monitor LG Ultrawide 29 polegadas, resolução 2560x1080.',
      category: 'Eletrônicos',
      price: 1599.5,
    };

    const user1 : CreateUserDto= {
      name: 'Usuário1',
      email: 'email@do.user2',
      role: Role.USER,
      password: '123567890',
    };

    const prod1 = await prodService.save(prod);
    const { id: userId } = await userService.create(user1);
    const movimentation: Moviment = {
      note: 'daaed',
      quantity: 50,
      type: MovementType.IN,
      userId: userId,
    };
    prodId.push(prod1?.id as string)

    await prodService.moviment(movimentation, prod1?.id as string);
    await app.init();
  });

  describe('simples', () => {

    it('get movimentation', async () => {
      

    return await request(app.getHttpServer())
        .get(`/movements?page=1&limit=20&type=IN&search=Monitor&productId=${prodId[0]}&dateFrom=2025-01-01&dateTo=2027-01-31`)
        .expect(200)
        .then(res => {
          expect(res.body[0].type).toBe(MovementType.IN)
        })

    });
  });
});
