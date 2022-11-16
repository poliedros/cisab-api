import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UnitsController } from './units.controller';
import { UnitsRepository } from './units.repository';
import { UnitsService } from './units.service';
import { Unit, UnitSchema } from './schemas/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
  ],
  controllers: [UnitsController],
  providers: [UnitsService, UnitsRepository],
  exports: [UnitsService],
})
export class UnitsModule {}
