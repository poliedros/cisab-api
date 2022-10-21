import { RolesGuard } from './../guards/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';

@Controller('example')
export class ExampleController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Cisab)
  get() {
    return ['hello world'];
  }
}
