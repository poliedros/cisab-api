import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifierModule } from '../notifier/notifier.module';
import { UsersModule } from '../users/users.module';
import { ForgetPasswordController } from './forget-password.controller';
import { ForgetPasswordRepository } from './forget-password.repository';
import { ForgetPasswordService } from './forget-password.service';
import {
  ForgetPassword,
  ForgetPasswordSchema,
} from './schemas/forget-password.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForgetPassword.name, schema: ForgetPasswordSchema },
    ]),
    NotifierModule,
    UsersModule,
  ],
  controllers: [ForgetPasswordController],
  providers: [ForgetPasswordService, ForgetPasswordRepository],
})
export class ForgetPasswordModule {}
