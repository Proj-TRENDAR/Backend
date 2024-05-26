import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineController } from 'src/routine/routine.controller'
import { RoutineService } from 'src/routine/routine.service'
import { RoutineDayService } from 'src/routine/routine-day/routine-day.service'
import { RoutineCompletedService } from 'src/routine/routine-completed/routine-completed.service'
import { Routine, RoutineCompleted, RoutineDay } from 'models'
import { RoutineCompletedModule } from './routine-completed/routine-completed.module'

@Module({
  imports: [SequelizeModule.forFeature([Routine, RoutineDay]), RoutineCompletedModule],
  controllers: [RoutineController],
  providers: [RoutineService, RoutineDayService],
})
export class RoutineModule {}
