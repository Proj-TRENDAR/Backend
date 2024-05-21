import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineCompletedController } from './routine-completed.controller'
import { RoutineCompletedService } from './routine-completed.service'
import { RoutineModule } from '../routine.module'

@Module({
  imports: [SequelizeModule.forFeature([RoutineModule])],
  controllers: [RoutineCompletedController],
  providers: [RoutineCompletedService],
})
export class RoutineCompletedModule {}
