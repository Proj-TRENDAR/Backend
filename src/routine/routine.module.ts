import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineController } from 'src/routine/routine.controller'
import { RoutineService } from 'src/routine/routine.service'
import { RoutineDayService } from 'src/routine/routine-day/routine-day.service'
import { RoutineCompletedService } from 'src/routine/routine-completed/routine-completed.service'
import { Routine, RoutineCompleted, RoutineDay } from 'models'

@Module({
  imports: [SequelizeModule.forFeature([Routine, RoutineCompleted, RoutineDay])],
  controllers: [RoutineController],
  providers: [RoutineService, RoutineDayService, RoutineCompletedService],
})
export class RoutineModule {}
