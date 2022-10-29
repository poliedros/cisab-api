import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { notifierConstants } from './notify.constants';

@Injectable()
export class NotifierService {
  constructor(
    @Inject(notifierConstants.NOTIFIER_SERVICE) private client: ClientProxy,
  ) {}

  emit({ type, message }: { type: string; message: any }) {
    return this.client.emit(notifierConstants.NOTIFY, { type, message });
  }
}
