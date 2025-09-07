import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { User } from 'src/models/User';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserService } from '../src/user/user.service';
describe('user tests', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

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

  const users: User[] = [
    {
        name: "Usuário1",
        email: "email@do.user",
        password: "123567890"
    }
  ]


  describe("Crud", () => {
    it('/product (POST)', async () => {
          return await request(app.getHttpServer())
            .post('/products')
            .send(users[0])
            .expect(201)
            .then((response) => {
              expect(response.body).toHaveProperty('id');
              expect(response.body.name).toBe(users[0].name);
              expect(response.body.email).toBe(users[0].email);
              expect(response.body.role).toBe("USER");
              expect(response.body.password).toBeNull()
            });
        });
    
  })

})