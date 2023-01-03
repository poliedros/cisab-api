import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';
import { Demand, DemandSchema } from './schemas/demand.schema';
import { DemandsRepository } from './demands.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Demand.name, schema: DemandSchema }]),
  ],
  controllers: [DemandsController],
  providers: [DemandsService, DemandsRepository],
})
export class DemandsModule {}
