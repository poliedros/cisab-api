import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { ForgetPassword } from './schemas/forget-password.schema';

@Injectable()
export class ForgetPasswordRepository extends AbstractRepository<ForgetPassword> {
  protected readonly logger = new Logger(ForgetPasswordRepository.name);

  constructor(
    @InjectModel(ForgetPassword.name)
    forgetPasswordModel: Model<ForgetPassword>,
    @InjectConnection() connection: Connection,
  ) {
    super(forgetPasswordModel, connection);
  }
}
