import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineDayController } from './routine-day.controller'
import { RoutineDayService } from './routine-day.service'
import { RoutineDay } from 'models'

@Module({
  imports: [SequelizeModule.forFeature([RoutineDay])],
  controllers: [RoutineDayController],
  providers: [RoutineDayService],
  exports: [RoutineDayService],
})
export class RoutineDayModule {}
