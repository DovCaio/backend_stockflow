import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService){}

    async create(user:User) : Promise<any | null>{
        const result  =  await this.prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: user.password,
                role: user.role
            }
        })

        return result


        
    }

}
