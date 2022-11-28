import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotifierService } from '../notifier/notifier.service';
import { ForgetPasswordRepository } from './forget-password.repository';
import { ForgetPassword } from './schemas/forget-password.schema';

@Injectable()
export class ForgetPasswordService {
  private readonly logger = new Logger(ForgetPasswordService.name);

  constructor(
    private readonly forgetPasswordRepository: ForgetPasswordRepository,
    private readonly notifierService: NotifierService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * send an notification to user with forget password id
   
   * forget password is then used by updatePassword args
   */
  async run(email: string) {
    const session = await this.forgetPasswordRepository.startTransaction();

    try {
      const user = await this.usersService.findOne({ email });

      if (!user) throw new NotFoundException();

      const forgetPassword: ForgetPassword = {
        _id: null,
        userId: user._id.toString(),
      };

      const { _id: forgetPasswordId } =
        await this.forgetPasswordRepository.create(forgetPassword);

      const message = {
        to: user.email,
        body: `If you requested to change your password, click <a href=${process.env.WEBSITE_URL}/forget-password/${forgetPasswordId}>here</a>`,
        subject: `Cisab - Recovery password`,
      };

      this.logger.log(`sending email to: ${user.email}`);
      this.notifierService.emit({ type: 'forget-password', message });
    } catch (err) {
      this.logger.error(err);

      await session.abortTransaction();
      throw err;
    }
  }

  /**
   * update user password
   */
  async updatePassword(forgetPasswordId: string, newPassword: string) {}
}
