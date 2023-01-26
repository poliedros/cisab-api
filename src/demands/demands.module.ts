import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';
import { Demand, DemandSchema } from './schemas/demand.schema';
import { DemandsRepository } from './demands.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Demand.name, schema: DemandSchema }]),
    ProductsModule,
  ],
  controllers: [DemandsController],
  providers: [DemandsService, DemandsRepository],
})
export class DemandsModule {}
