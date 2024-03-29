import { Module } from '@nestjs/common'
import { RoutineController } from 'src/routine/routine.controller'
import { RoutineService } from 'src/routine/routine.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Routine, RoutineCompleted, RoutineDay } from 'models'

@Module({
  imports: [SequelizeModule.forFeature([Routine, RoutineCompleted, RoutineDay])],
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
