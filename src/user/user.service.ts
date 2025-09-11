import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../models/CreateUserDto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async create(user: CreateUserDto): Promise<any | null> {
    const result: any = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete result.password;
    return result;
  }
}
