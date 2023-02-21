import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { NotifierModule } from '../notifier/notifier.module';
import { CountiesService } from './counties.service';
import { CountiesController } from './counties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CountiesRepository } from './counties.repository';
import { County, CountySchema } from './schemas/county.schema';

@Module({
  imports: [
    NotifierModule,
    MongooseModule.forFeature([{ name: County.name, schema: CountySchema }]),
    UsersModule,
  ],
  controllers: [CountiesController],
  providers: [CountiesService, CountiesRepository],
  exports: [CountiesService],
})
export class CountiesModule {}
