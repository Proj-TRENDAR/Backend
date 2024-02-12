import { Module } from '@nestjs/common'
import { CompletedRoutineController } from './completed-routine.controller'
import { CompletedRoutineService } from './completed-routine.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { RoutineModule } from '../routine.module'

@Module({
  imports: [SequelizeModule.forFeature([RoutineModule])],
  controllers: [CompletedRoutineController],
  providers: [CompletedRoutineService],
})
export class CompletedRoutineModule {}
