import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';
import { RolesGuard } from './../guards/roles.guard';
import { CreateUserDto } from './dtos/create.user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    const { username, roles } = createUserDto;
    return { username, roles };
  }
}
