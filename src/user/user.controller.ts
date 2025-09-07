import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../models/User';

@Controller('users')
export class UserController {

    constructor (private readonly userService : UserService){}

    @Post()
    create(@Body() user: User){

        return this.userService.create(user)

    }

}
