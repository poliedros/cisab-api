import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
   
   * forget password id is then used by updatePassword args
   */
  async run(email: string) {
    const session = await this.forgetPasswordRepository.startTransaction();

    try {
      const user = await this.usersService.findOneOrReturnNull({ email });

      if (!user) throw new NotFoundException();

      const forgetPassword: ForgetPassword = {
        _id: null,
        userId: user._id.toString(),
        createdAt: new Date(),
      };

      const { _id: forgetPasswordId } =
        await this.forgetPasswordRepository.create(forgetPassword);

      const message = {
        to: user.email,
        body: `If you requested to change your password, click <a href=${process.env.WEBSITE_URL}/forget-password/${forgetPasswordId}>here</a>`,
        subject: `Cisab - Recovery password`,
      };

      this.logger.log(`sending email to: ${user.email}`);
      this.notifierService.emit({ type: 'send_email', message });

      await session.commitTransaction();
    } catch (err) {
      this.logger.error(err);

      await session.abortTransaction();
      throw err;
    }
  }

  /**
   * update user password
   */
  async updatePassword(forgetPasswordId: string, newPassword: string) {
    const forgetPassword = await this.forgetPasswordRepository.findOne({
      _id: forgetPasswordId,
    });

    await this.validateForgetPassword(forgetPassword);

    const user = await this.usersService.findOneOrReturnNull({
      _id: forgetPassword.userId,
    });

    if (!user) throw new NotFoundException('User not found');

    const session = await this.forgetPasswordRepository.startTransaction();
    try {
      forgetPassword.oldPassword = user.password;

      user.password = newPassword;
      this.logger.log(`new password: ${user.password}`);

      const { password: newUserPassword } = await this.usersService.update(
        user,
      );

      forgetPassword.newPassword = newUserPassword;

      await this.forgetPasswordRepository.upsert(
        {
          _id: forgetPassword._id,
        },
        forgetPassword,
      );

      const message = {
        to: user.email,
        body: `Your password was updated. If it was not you, contact immediately the administrator.`,
        subject: `Cisab - Recovery password`,
      };
      this.notifierService.emit({ type: 'forget-password', message });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  /**
   * validates forget password id
   * @param id
   * @returns boolean
   */
  async validate(id: string) {
    const forgetPassword = await this.forgetPasswordRepository.findOne({
      _id: id,
    });

    return this.validateForgetPassword(forgetPassword);
  }

  /**
   * validates forget password
   * @param forgetPassword
   * @returns boolean
   */
  private async validateForgetPassword(forgetPassword: ForgetPassword) {
    const isEqual = (f1: ForgetPassword, f2: ForgetPassword) => {
      return true
        ? f1._id.toString() === f2._id.toString() &&
            f1.userId === f2.userId &&
            f1.createdAt.toString() === f2.createdAt.toString()
        : false;
    };

    if (!forgetPassword) {
      throw new BadRequestException();
    }

    // it means that this forget password was already used.
    if (forgetPassword.oldPassword) {
      throw new BadRequestException();
    }

    const forgetPasswords = await this.forgetPasswordRepository.sort(
      { userId: forgetPassword.userId },
      { createdAt: -1 },
    );

    if (forgetPasswords.length === 0) return true;

    if (!isEqual(forgetPassword, forgetPasswords[0]))
      throw new BadRequestException(
        'This forget password is not valid anymore.',
      );

    return true;
  }
}
