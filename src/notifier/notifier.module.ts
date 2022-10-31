import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotifierService } from './notifier.service';
import { notifierConstants } from './notify.constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: notifierConstants.NOTIFIER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'notifier',
          queueOptions: {
            durable: false,
          },
          noAck: false,
          persistent: true,
        },
      },
    ]),
  ],
  providers: [NotifierService],
  exports: [NotifierService],
})
export class NotifierModule {}
