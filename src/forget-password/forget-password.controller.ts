import { Body, Controller, Post } from '@nestjs/common';
import { ForgetPasswordRequest } from './dto/request/forget-password-request.dto';
import { NewPasswordRequest } from './dto/request/new-password-request.dto';
import { ForgetPasswordService } from './forget-password.service';

@Controller('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post()
  async forgetPassword(@Body() { email }: ForgetPasswordRequest) {
    await this.forgetPasswordService.run(email);
  }

  @Post('/new')
  async newPassword(
    @Body() { forgetPasswordId, newPassword }: NewPasswordRequest,
  ) {
    await this.forgetPasswordService.updatePassword(
      forgetPasswordId,
      newPassword,
    );
  }
}
