import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgetPasswordRequest } from './dto/request/forget-password-request.dto';
import { NewPasswordRequest } from './dto/request/new-password-request.dto';
import { ForgetPasswordService } from './forget-password.service';

@ApiTags('forget-password')
@Controller('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @ApiOperation({
    summary: 'Forget password',
    description: 'Forgotten password? ',
  })
  @ApiBody({ type: ForgetPasswordRequest })
  @Post()
  async forgetPassword(@Body() { email }: ForgetPasswordRequest) {
    try {
      await this.forgetPasswordService.run(email);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Recovery password',
    description: 'Recovery password through this route',
  })
  @ApiBody({ type: NewPasswordRequest })
  @Post('/recovery/:id')
  async recovery(
    @Param('id') id: string,
    @Body() { password }: NewPasswordRequest,
  ) {
    try {
      await this.forgetPasswordService.updatePassword(id, password);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Validate password link',
    description: 'Validate password link',
  })
  @Post('/:id/validate')
  @HttpCode(200)
  async validate(@Param('id') id: string) {
    try {
      await this.forgetPasswordService.validate(id);
    } catch (err) {
      throw err;
    }
  }
}
