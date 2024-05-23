import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineDayController } from './routine-day.controller'
import { RoutineDayService } from './routine-day.service'
import { RoutineModule } from '../routine.module'

@Module({
  imports: [SequelizeModule.forFeature([RoutineModule])],
  controllers: [RoutineDayController],
  providers: [RoutineDayService],
})
export class RoutineDayModule {}
