import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineController } from 'src/routine/routine.controller'
import { RoutineService } from 'src/routine/routine.service'
import { Routine } from 'models'
import { RoutineCompletedModule } from './routine-completed/routine-completed.module'
import { RoutineDayModule } from './routine-day/routine-day.module'

@Module({
  imports: [SequelizeModule.forFeature([Routine]), RoutineCompletedModule, RoutineDayModule],
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
