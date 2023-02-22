import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { CartsRequest } from './dto/request/carts-request.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { GetCartResponse } from './dto/response/get-cart-response.dto';
import { CartsService } from './carts.service';
import { Payload } from 'src/auth/auth.service';

@Controller('carts')
export class CartsController {
  private readonly logger = new Logger(CartsController.name);

  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Upsert cart', description: 'forbidden' })
  @ApiBody({ type: CartsRequest })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Manager)
  @Post()
  upsertCart(@Body() cart: CartsRequest, @Request() req) {
    try {
      const userPayload = req.user;
      return this.cartsService.upsert(
        cart,
        userPayload.county_id,
        userPayload.id,
      );
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get cart', description: 'forbidden' })
  @ApiBody({ type: GetCartResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Manager)
  @Get(':demand_id')
  getCart(
    @Param('demand_id') demandId: string,
    @Request() req,
  ): Promise<GetCartResponse> {
    try {
      const userPayload = req.user;
      return this.cartsService.get(
        userPayload.county_id,
        demandId,
        userPayload.id,
      );
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Close cart', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee, Role.Manager)
  @Post(':demand_id/close')
  closeCart(@Param('demand_id') demandId: string, @Request() req) {
    try {
      const userPayload = req.user as Payload;
      return this.cartsService.close(userPayload.county_id, demandId);
    } catch (err) {
      throw new BadRequestException();
    }
  }
}
