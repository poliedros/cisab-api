import { County, CountySchema } from './schemas/county.schema';
import { Module } from '@nestjs/common';
import { CountiesService } from './counties.service';
import { CountiesController } from './counties.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: County.name, schema: CountySchema }]),
  ],
  controllers: [CountiesController],
  providers: [CountiesService],
})
export class CountiesModule {}
