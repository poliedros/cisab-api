import { Body, Controller, Param, Post } from '@nestjs/common';
import { ForgetPasswordRequest } from './dto/request/forget-password-request.dto';
import { NewPasswordRequest } from './dto/request/new-password-request.dto';
import { ForgetPasswordService } from './forget-password.service';

@Controller('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post()
  async forgetPassword(@Body() { email }: ForgetPasswordRequest) {
    try {
      await this.forgetPasswordService.run(email);
    } catch (err) {
      throw err;
    }
  }

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
}
