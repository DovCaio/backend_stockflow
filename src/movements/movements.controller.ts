import { Controller, Get, Query } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { Query4 } from '../models/Query1';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementeservice: MovementsService) {}

  @Get()
  getOneMovement(@Query() query: Query4) {
    return this.movementeservice.get(query);
  }
}
