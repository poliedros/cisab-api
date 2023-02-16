import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { CartsRequest } from './dto/request/carts-request.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { GetCartResponse } from './dto/response/get-cart-response.dto';

@Controller('carts')
export class CartsController {
  @ApiOperation({ summary: 'Update cart', description: 'forbidden' })
  @ApiBody({ type: CartsRequest })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Manager)
  @Post()
  upsertCart(cart: CartsRequest) {
    throw new NotImplementedException();
  }

  @ApiOperation({ summary: 'Get cart', description: 'forbidden' })
  @ApiBody({ type: CartsRequest })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Manager)
  @Get(':demand_id')
  getCart(@Param('demand_id') demand_id: string): Promise<GetCartResponse> {
    throw new NotImplementedException();
  }

  @ApiOperation({ summary: 'Close cart', description: 'forbidden' })
  @ApiBody({ type: CartsRequest })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Manager)
  @Post(':demand_id/close')
  closeCart(@Param('demand_id') demand_id: string) {
    throw new NotImplementedException();
  }
}
