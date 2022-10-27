import { Module } from '@nestjs/common';
import { CountiesService } from './counties.service';
import { CountiesController } from './counties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CountiesRepository } from './counties.repository';
import { County, CountySchema } from './schemas/county.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: County.name, schema: CountySchema }]),
  ],
  controllers: [CountiesController],
  providers: [CountiesService, CountiesRepository],
})
export class CountiesModule {}
