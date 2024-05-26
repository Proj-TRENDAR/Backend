import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineCompletedController } from './routine-completed.controller'
import { RoutineCompletedService } from './routine-completed.service'
import { RoutineCompleted } from 'models'

@Module({
  imports: [SequelizeModule.forFeature([RoutineCompleted])],
  controllers: [RoutineCompletedController],
  providers: [RoutineCompletedService],
  exports: [RoutineCompletedService],
})
export class RoutineCompletedModule {}
